<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMainStore } from '~/store';

const store = useMainStore();
const { account } = storeToRefs(store);

const apiKey = computed(() => account.value?.apiKey ?? '');
const apiSecret = computed(() => account.value?.apiSecret ?? '');
const hasApiKeys = computed(() => apiKey.value && apiSecret.value);

const regenerateKeys = async () => await store.updateKeys();

const { t } = useI18n();
</script>

<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div class="text-h6">{{ t('account.api_keys.title') }}</div>
      <div>
        <RuiButton color="primary" @click="regenerateKeys()">
          <template #prepend>
            <RuiIcon name="refresh-line" />
          </template>
          {{ hasApiKeys ? t('actions.regenerate') : t('actions.generate') }}
        </RuiButton>
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <RuiRevealableTextField
        id="username"
        :model-value="apiKey"
        variant="outlined"
        :label="t('account.api_keys.api_key')"
        readonly
        hide-details
        color="primary"
      >
        <template #append>
          <div class="h-6 border-r border-rui-grey-400 ml-2 mr-1" />
          <CopyButton :model-value="apiKey" />
        </template>
      </RuiRevealableTextField>

      <RuiRevealableTextField
        id="username"
        :model-value="apiSecret"
        variant="outlined"
        :label="t('account.api_keys.api_secret')"
        readonly
        hide-details
        color="primary"
      >
        <template #append>
          <div class="h-6 border-r border-rui-grey-400 ml-2 mr-1" />
          <CopyButton :model-value="apiSecret" />
        </template>
      </RuiRevealableTextField>
    </div>
  </div>
</template>
