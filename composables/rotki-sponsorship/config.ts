import { get } from '@vueuse/shared';
import { computed } from 'vue';
import { useLeaderboardMetadata } from '~/composables/use-leaderboard-metadata';
import { getBackendUrl } from '~/utils/proxy';
import { useLogger } from '~/utils/use-logger';
import { CHAIN_CONFIGS, FALLBACK_CHAIN, FALLBACK_CONTRACT_ADDRESS } from './constants';

// For client-side usage (composables)
export function useNftConfig() {
  const { chainId, contractAddress, rpcUrl } = useLeaderboardMetadata();

  return {
    CHAIN_ID: computed<number>(() => get(chainId) || CHAIN_CONFIGS[FALLBACK_CHAIN].chainId),
    CONTRACT_ADDRESS: computed<string>(() => get(contractAddress) || FALLBACK_CONTRACT_ADDRESS),
    RPC_URL: computed<string>(() => get(rpcUrl) || CHAIN_CONFIGS[FALLBACK_CHAIN].rpcUrl),
  };
}

// Storage for detecting contract address changes
let lastContractAddress: string | undefined;

// For server-side usage (API endpoints)
export async function getServerNftConfig() {
  const logger = useLogger();
  try {
    // Use the proxy utility to get the backend URL
    const apiUrl = getBackendUrl('/webapi/leaderboard/metadata/');

    // Log the URL for debugging
    logger.warn('[Server] Fetching leaderboard metadata from:', apiUrl);

    // Fetch metadata from the API - this is public data, no auth needed
    const response = await $fetch<{
      contract_address: string;
      chain: 'sepolia' | 'ethereum';
    }>(apiUrl);

    const chainConfig = CHAIN_CONFIGS[response.chain];
    const currentAddress = response.contract_address;

    // Check if contract address has changed
    const hasContractChanged = lastContractAddress !== undefined && lastContractAddress !== currentAddress;
    if (hasContractChanged) {
      logger.warn(`Contract address changed from ${lastContractAddress} to ${currentAddress}`);
      // The cache will be automatically invalidated when defineCachedFunction
      // detects the key has changed (since we include contract address in cache keys)
    }
    lastContractAddress = currentAddress;

    return {
      CHAIN_ID: chainConfig.chainId,
      CONTRACT_ADDRESS: currentAddress,
      hasContractChanged,
      RPC_URL: chainConfig.rpcUrl,
    };
  }
  catch (error: any) {
    // Fallback to default values if metadata fetch fails
    logger.warn('Failed to fetch NFT config metadata:', error?.data || error?.message || error);

    // Log more details about the error for debugging
    if (error?.status === 404) {
      logger.warn('Leaderboard metadata endpoint not found. Using fallback values.');
    }

    return {
      CHAIN_ID: CHAIN_CONFIGS[FALLBACK_CHAIN].chainId,
      CONTRACT_ADDRESS: FALLBACK_CONTRACT_ADDRESS,
      hasContractChanged: false,
      RPC_URL: CHAIN_CONFIGS[FALLBACK_CHAIN].rpcUrl,
    };
  }
}
