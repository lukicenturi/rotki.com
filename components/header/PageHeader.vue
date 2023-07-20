<script setup lang="ts">
import { RuiButton, RuiLogo } from '@rotki/ui-library';
</script>

<template>
  <div class="py-6 border-b border-grey-200">
    <div
      class="container flex items-center justify-between flex-col lg:flex-row space-y-4 lg:space-y-0"
    >
      <NuxtLink to="/">
        <RuiLogo text />
      </NuxtLink>
      <div>
        <NavigationMenu />
      </div>
      <NuxtLink to="/home">
        <RuiButton rounded color="primary"> Manage Premium </RuiButton>
      </NuxtLink>
    </div>
  </div>
</template>
