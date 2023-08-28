<script lang="ts" setup>
definePageMeta({
  layout: 'account',
  middleware: ['maintenance', 'authentication'],
});
</script>

<template>
  <div class="space-y-10">
    <AccountDetails />
    <ChangePassword />
    <DangerZone />
  </div>
</template>
