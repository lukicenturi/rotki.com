import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, IPFS_URL, ROTKI_SPONSORSHIP_ABI, RPC_URL } from '~/composables/rotki-sponsorship/constants';

interface TierInfoCache {
  data: any;
  timestamp: number;
}

// Simple in-memory cache with TTL
const tierInfoCache = new Map<string, TierInfoCache>();
const metadataCache = new Map<string, TierInfoCache>();

// Cache TTL in milliseconds
const TIER_INFO_TTL = 5 * 60 * 1000; // 5 minutes
const METADATA_TTL = 60 * 60 * 1000; // 1 hour

function isCacheValid(cache: TierInfoCache | undefined, ttl: number): boolean {
  return cache !== undefined && (Date.now() - cache.timestamp) < ttl;
}

async function fetchWithCache<T>(
  key: string,
  cache: Map<string, { data: T; timestamp: number }>,
  ttl: number,
  fetchFn: () => Promise<T>,
): Promise<T> {
  const cached = cache.get(key);

  if (isCacheValid(cached, ttl)) {
    return cached!.data;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const tierIds = query.tierIds as string;
    const tierKeys = query.tierKeys as string;

    if (!tierIds || !tierKeys) {
      throw createError({
        statusCode: 400,
        statusMessage: 'tierIds and tierKeys parameters are required',
      });
    }

    const tierIdArray = tierIds.split(',').map(Number);
    const tierKeyArray = tierKeys.split(',');

    if (tierIdArray.length !== tierKeyArray.length) {
      throw createError({
        statusCode: 400,
        statusMessage: 'tierIds and tierKeys arrays must have the same length',
      });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ROTKI_SPONSORSHIP_ABI, provider);

    // Fetch current release ID (cached)
    const releaseId = await fetchWithCache(
      'currentReleaseId',
      tierInfoCache,
      TIER_INFO_TTL,
      async () => contract.currentReleaseId(),
    );

    const results: Record<string, any> = {};

    // Process each tier
    for (const [i, tierId] of tierIdArray.entries()) {
      const tierKey = tierKeyArray[i];
      const cacheKey = `tier-${releaseId}-${tierId}`;

      try {
        // Fetch tier info from contract (cached)
        const tierInfo = await fetchWithCache(
          cacheKey,
          tierInfoCache,
          TIER_INFO_TTL,
          async () => {
            const [maxSupply, currentSupply, metadataURI] = await contract.getTierInfo(releaseId, tierId);
            return { currentSupply: Number(currentSupply), maxSupply: Number(maxSupply), metadataURI };
          },
        );

        if (!tierInfo.metadataURI) {
          results[tierKey] = null;
          continue;
        }

        // Convert IPFS URI to HTTP URL
        let metadataUrl = tierInfo.metadataURI;
        if (tierInfo.metadataURI.startsWith('ipfs://')) {
          metadataUrl = `${IPFS_URL}${tierInfo.metadataURI.slice(7)}`;
        }

        // Fetch metadata (cached)
        const metadata = await fetchWithCache(
          metadataUrl,
          metadataCache,
          METADATA_TTL,
          async () => {
            const response = await fetch(metadataUrl);
            if (!response.ok) {
              throw new Error(`Metadata fetch error: ${response.status}`);
            }
            return response.json();
          },
        );

        // Process image URL
        let imageUrl = metadata.image;
        if (imageUrl && imageUrl.startsWith('ipfs://')) {
          imageUrl = `${IPFS_URL}${imageUrl.slice(7)}`;
        }

        // Extract benefits and release name from metadata
        const benefitsAttribute = metadata.attributes?.find((attr: any) => attr.trait_type === 'Benefits');
        const benefits = benefitsAttribute?.value || '';

        const releaseAttribute = metadata.attributes?.find((attr: any) =>
          attr.trait_type === 'Release' || attr.trait_type === 'Release Name',
        );
        const releaseName = releaseAttribute?.value || metadata.name || '';

        results[tierKey] = {
          benefits,
          currentSupply: tierInfo.currentSupply,
          description: metadata.description || '',
          imageUrl,
          maxSupply: tierInfo.maxSupply,
          metadataURI: tierInfo.metadataURI,
          releaseName,
        };
      }
      catch (error) {
        console.error(`Error fetching tier info for ${tierKey}:`, error);
        results[tierKey] = null;
      }
    }

    // Set cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300'); // 5 minutes
    setHeader(event, 'Vary', 'Accept-Encoding');

    return {
      data: results,
      success: true,
      timestamp: Date.now(),
    };
  }
  catch (error) {
    console.error('Error in tier-info API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
