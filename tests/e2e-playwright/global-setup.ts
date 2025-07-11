import type { FullConfig } from '@playwright/test';

async function globalSetup(_config: FullConfig) {
  // This will run before all tests
  // You can add any global setup logic here
  // For example: starting servers, setting up databases, etc.

  return async () => {
    // Global teardown
  };
}

export default globalSetup;
