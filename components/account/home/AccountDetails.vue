<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { get } from '@vueuse/core';
import { useMainStore } from '~/store';

const store = useMainStore();
const { account } = storeToRefs(store);

const email = computed(() => {
  const userAccount = get(account);
  return !userAccount ? '' : userAccount.email;
});

const username = computed(() => {
  const userAccount = get(account);
  return !userAccount ? '' : userAccount.username;
});

const { t } = useI18n();
</script>

<template>
  <div>
    <div class="text-h6 mb-6">
      Details
    </div>
    <div>
      <div class="space-y-5">
        <RuiTextField
          id="email"
          v-model="username"
          readonly
          variant="outlined"
          :label="t('auth.common.username')"
          hide-details
          color="primary"
        />
        <RuiTextField
          id="email"
          v-model="email"
          readonly
          variant="outlined"
          :label="t('auth.common.email')"
          hide-details
          color="primary"
        />
      </div>

      <div class="mt-10 mb-5 border-t border-grey-50" />
    </div>
  </div>
</template>
