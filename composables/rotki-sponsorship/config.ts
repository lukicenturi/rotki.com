import { get } from '@vueuse/shared';
import { computed } from 'vue';
import { useLeaderboardMetadata } from '~/composables/use-leaderboard-metadata';
import { getBackendUrl } from '~/utils/proxy';

// Export the ABI constants that don't change
export { ERC20_ABI, ETH_ADDRESS, IPFS_URL, ROTKI_SPONSORSHIP_ABI } from './constants';

// Fallback values for when metadata is not available
const FALLBACK_CONTRACT_ADDRESS = '0x9C4Ac51128b3B29c8c4C76c960a07c17b8290557';
const FALLBACK_CHAIN_ID = 11155111; // Sepolia
const FALLBACK_RPC_URL = 'https://sepolia.gateway.tenderly.co';

// For client-side usage (composables)
export function useNftConfig() {
  const { chainId, contractAddress, rpcUrl } = useLeaderboardMetadata();

  return {
    CHAIN_ID: computed<number>(() => get(chainId) || FALLBACK_CHAIN_ID),
    CONTRACT_ADDRESS: computed<string>(() => get(contractAddress) || FALLBACK_CONTRACT_ADDRESS),
    RPC_URL: computed<string>(() => get(rpcUrl) || FALLBACK_RPC_URL),
  };
}

// Storage for detecting contract address changes
let lastContractAddress: string | null = null;

// For server-side usage (API endpoints)
export async function getServerNftConfig() {
  try {
    // Use the proxy utility to get the backend URL
    const apiUrl = getBackendUrl('/webapi/leaderboard/metadata/');

    // Log the URL for debugging
    console.warn('[Server] Fetching leaderboard metadata from:', apiUrl);

    // Fetch metadata from the API - this is public data, no auth needed
    const response = await $fetch<{
      contract_address: string;
      chain: 'sepolia' | 'ethereum';
    }>(apiUrl);

    const chainConfigs = {
      ethereum: {
        chainId: 1,
        rpcUrl: 'https://ethereum.gateway.tenderly.co',
      },
      sepolia: {
        chainId: 11155111,
        rpcUrl: 'https://sepolia.gateway.tenderly.co',
      },
    };

    const chainConfig = chainConfigs[response.chain];
    const currentAddress = response.contract_address;

    // Check if contract address has changed
    const hasContractChanged = lastContractAddress !== null && lastContractAddress !== currentAddress;
    if (hasContractChanged) {
      console.warn(`Contract address changed from ${lastContractAddress} to ${currentAddress}`);
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
    console.warn('Failed to fetch NFT config metadata:', error?.data || error?.message || error);

    // Log more details about the error for debugging
    if (error?.status === 404) {
      console.warn('Leaderboard metadata endpoint not found. Using fallback values.');
    }

    return {
      CHAIN_ID: FALLBACK_CHAIN_ID,
      CONTRACT_ADDRESS: FALLBACK_CONTRACT_ADDRESS,
      hasContractChanged: false,
      RPC_URL: FALLBACK_RPC_URL,
    };
  }
}
