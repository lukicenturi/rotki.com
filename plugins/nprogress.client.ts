import { useNProgress } from '@vueuse/integrations/useNProgress';

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();

  // Configure NProgress options
  const nprogress = useNProgress(null, {
    minimum: 0.1,
    showSpinner: false,
    speed: 200,
    trickleSpeed: 200,
  });

  // Start progress bar on route change start
  router.beforeEach((to, from) => {
    // Only show progress for actual navigation, not hash changes
    if (to.path !== from.path) {
      nprogress.start();
    }
  });

  // Complete progress bar on route change end
  router.afterEach(() => {
    nprogress.done();
  });

  // Handle route errors
  router.onError(() => {
    nprogress.done();
  });

  // Also hook into Nuxt's page loading states for SSR/async data
  nuxtApp.hook('page:start', () => {
    nprogress.start();
  });

  nuxtApp.hook('page:finish', () => {
    nprogress.done();
  });

  // Provide nprogress instance globally if needed
  return {
    provide: {
      nprogress,
    },
  };
});
