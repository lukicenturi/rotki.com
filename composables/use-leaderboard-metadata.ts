import { get, set } from '@vueuse/shared';
import { computed, ref } from 'vue';
import { z } from 'zod';
import { fetchWithCsrf } from '~/utils/api';
import { useLogger } from '~/utils/use-logger';

const logger = useLogger('use-leaderboard-metadata');

const LeaderboardMetadataSchema = z.object({
  chain: z.enum(['sepolia', 'ethereum']),
  contractAddress: z.string(),
  lastUpdated: z.string(),
});

export type LeaderboardMetadata = z.infer<typeof LeaderboardMetadataSchema>;

interface ChainConfig {
  chainId: number;
  rpcUrl: string;
}

const CHAIN_CONFIGS: Record<'sepolia' | 'ethereum', ChainConfig> = {
  ethereum: {
    chainId: 1,
    rpcUrl: 'https://ethereum.gateway.tenderly.co',
  },
  sepolia: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.gateway.tenderly.co',
  },
};

const metadata = ref<LeaderboardMetadata | null>(null);
const loading = ref<boolean>(false);
const error = ref<Error | null>(null);

export function useLeaderboardMetadata() {
  const contractAddress = computed<string | null>(() => get(metadata)?.contractAddress || null);
  const lastUpdated = computed<string | null>(() => get(metadata)?.lastUpdated || null);
  const chain = computed<'sepolia' | 'ethereum' | null>(() => get(metadata)?.chain || null);

  const chainConfig = computed<ChainConfig | null>(() => {
    const chainName = get(chain);
    if (!chainName)
      return null;
    return CHAIN_CONFIGS[chainName];
  });

  const chainId = computed<number | null>(() => get(chainConfig)?.chainId || null);
  const rpcUrl = computed<string | null>(() => get(chainConfig)?.rpcUrl || null);

  async function fetchMetadata(): Promise<void> {
    try {
      set(loading, true);
      set(error, null);

      const response = await fetchWithCsrf('/webapi/leaderboard/metadata/', {
        method: 'GET',
      });

      const validatedResponse = LeaderboardMetadataSchema.parse(response);
      set(metadata, validatedResponse);
    }
    catch (error_) {
      logger.error('Error fetching leaderboard metadata:', error_);
      set(error, error_ as Error);
    }
    finally {
      set(loading, false);
    }
  }

  return {
    chain,
    chainConfig: readonly(chainConfig),
    chainId: readonly(chainId),
    contractAddress: readonly(contractAddress),
    error: readonly(error),
    fetchMetadata,
    lastUpdated: readonly(lastUpdated),
    loading: readonly(loading),
    metadata: readonly(metadata),
    rpcUrl: readonly(rpcUrl),
  };
}
