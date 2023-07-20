<script setup lang="ts">
import { RuiProgress } from '@rotki/ui-library';
import { set } from '@vueuse/core';
import { FetchError } from 'ofetch';
import { fetchWithCsrf } from '~/utils/api';

const route = useRoute();
const { uid, token } = route.params;
const validating = ref(true);
const isValid = ref(false);

const validateToken = async () => {
  try {
    await fetchWithCsrf(`/webapi/activate/${uid}/${token}/`);
    set(isValid, true);
  } catch (e: any) {
    if (!(e instanceof FetchError && e.status === 404)) {
      logger.debug(e);
    }
  } finally {
    set(validating, false);
  }
};

onBeforeMount(async () => await validateToken());
</script>

<template>
  <div
    class="container py-16 lg:pt-[200px] lg:pb-32 flex flex-col items-center justify-center"
  >
    <div class="w-[360px]">
      <div v-if="validating" class="flex justify-center">
        <RuiProgress variant="indeterminate" circular color="primary" />
      </div>
      <div v-else-if="!isValid" class="space-y-3">
        <div class="text-h4">Invalid Link</div>
        <div class="text-body-1 text-rui-text-secondary">
          The activation link is not valid. This can happen if you have already
          confirmed your account.
        </div>
      </div>
      <div v-else class="space-y-3">
        <div class="text-h4">Welcome to rotki</div>
        <div class="text-body-1 text-rui-text-secondary">
          <span>
            Your rotki account has been successfully activated. To see your
            dashboard click
          </span>
          <ButtonLink to="/home" inline color="primary">here</ButtonLink>
        </div>
      </div>
    </div>
  </div>
</template>
