<script setup lang="ts">
import { RuiButton } from '@rotki/ui-library';

withDefaults(
  defineProps<{
    to: string;
    external?: boolean;
    inline?: boolean;
  }>(),
  {
    external: false,
    inline: false,
  },
);

const attrs = useAttrs();
</script>

<template>
  <NuxtLink
    :href="external ? to : undefined"
    :to="external ? undefined : to"
    :target="external ? '_blank' : '_self'"
    :rel="external ? 'noreferrer' : null"
  >
    <RuiButton
      v-bind="{ variant: 'text', ...attrs }"
      :class="{ ['inline-flex py-0 !px-1 !text-[1em]']: inline }"
    >
      <slot>
        {{ to }}
      </slot>
      <template #append>
        <slot name="append" />
      </template>
    </RuiButton>
  </NuxtLink>
</template>
