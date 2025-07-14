import { useLeaderboardMetadata } from '~/composables/use-leaderboard-metadata';

export default defineNuxtPlugin(async () => {
  // Fetch leaderboard metadata on app initialization
  // This ensures the NFT config is available early
  const { fetchMetadata } = useLeaderboardMetadata();

  try {
    await fetchMetadata();
  }
  catch (error) {
    // Don't block app initialization if metadata fetch fails
    console.warn('Failed to fetch leaderboard metadata on init:', error);
  }
});
