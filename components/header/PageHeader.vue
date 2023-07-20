<script setup lang="ts">
import { RuiButton, RuiLogo } from '@rotki/ui-library';
const { t } = useI18n();
</script>

<template>
  <div class="py-6 border-b border-grey-200">
    <div
      class="container flex items-center justify-center lg:justify-between flex-wrap lg:flex-row space-y-4 lg:space-y-0"
    >
      <NuxtLink to="/" class="flex justify-center w-full lg:w-auto">
        <RuiLogo text />
      </NuxtLink>
      <div>
        <NavigationMenu />
      </div>
      <NuxtLink to="/home" class="ml-6">
        <RuiButton rounded color="primary">
          {{ t('page_header.manage_premium') }}
        </RuiButton>
      </NuxtLink>
    </div>
  </div>
</template>
