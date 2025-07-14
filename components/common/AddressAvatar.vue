<script setup lang="ts">
import { set } from '@vueuse/core';
import { useBlockie } from '~/composables/use-blockie';

interface Props {
  ensName?: string | null;
  address: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const avatarUrl = ref<string | null>(null);
const loading = ref<boolean>(false);
const hasError = ref<boolean>(false);

const { getBlockie } = useBlockie();

const sizeClasses = computed(() => ({
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}[props.size]));

// Get blockie for the address
const blockieUrl = computed(() => getBlockie(props.address));

async function fetchAvatar() {
  if (!props.ensName) {
    return;
  }

  try {
    set(loading, true);
    set(hasError, false);

    // Use ENS metadata service to get avatar
    const response = await fetch(`https://metadata.ens.domains/mainnet/avatar/${props.ensName}`);

    if (response.ok) {
      // The metadata service returns the image directly
      set(avatarUrl, `https://metadata.ens.domains/mainnet/avatar/${props.ensName}`);
    }
    else {
      set(hasError, true);
    }
  }
  catch (error) {
    console.warn('Failed to fetch ENS avatar:', error);
    set(hasError, true);
  }
  finally {
    set(loading, false);
  }
}

onMounted(() => {
  fetchAvatar();
});

// Re-fetch if ENS name changes
watch(() => props.ensName, () => {
  fetchAvatar();
});
</script>

<template>
  <div
    class="relative rounded-full overflow-hidden shrink-0"
    :class="sizeClasses"
  >
    <!-- Loading state for ENS avatar -->
    <div
      v-if="loading && ensName"
      class="absolute inset-0 bg-rui-grey-200 animate-pulse"
    />

    <!-- ENS Avatar image -->
    <img
      v-else-if="avatarUrl && !hasError && ensName"
      :src="avatarUrl"
      :alt="`${ensName} avatar`"
      class="w-full h-full object-cover"
      @error="hasError = true"
    />

    <!-- Fallback to blockie -->
    <img
      v-else-if="blockieUrl"
      :src="blockieUrl"
      :alt="`Blockie for ${address}`"
      class="w-full h-full"
    />
  </div>
</template>
