<script lang="ts" setup>
import { RuiButton } from '@rotki/ui-library';

const emit = defineEmits<{
  (e: 'next'): void;
}>();
</script>

<template>
  <div class="text-center space-y-3 grow">
    <div class="text-h4">Important Note</div>
    <div class="text-body-1 text-rui-text-secondary">
      Creating an account in rotki.com is only needed to purchase a
      <strong>premium subscription</strong>. Rotki is a local application and
      the account you create when you use it is stored on your computer.
      <br />
      <br />
      This is not the same account as premium and credentials for one account
      don't work for the other. To use Rotki simply
      <ButtonLink to="/external" inline color="primary" class="underline">
        download
      </ButtonLink>
      and run it.
      <br />
      <br />
      Proceed only if you intend to purchase premium and unlock the premium
      features of the application.
    </div>
  </div>
  <div class="mt-16">
    <RuiButton color="primary" class="w-full" size="lg" @click="emit('next')">
      Continue
    </RuiButton>
  </div>
</template>
