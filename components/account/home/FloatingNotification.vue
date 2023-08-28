<script setup lang="ts">
import { type ContextColorsType } from '@rotki/ui-library/dist/consts/colors';

withDefaults(
  defineProps<{
    visible: boolean;
    closeable?: boolean;
    type?: ContextColorsType;
  }>(),
  {
    closeable: false,
    type: 'error',
  },
);

const emit = defineEmits<{
  (e: 'dismiss'): void;
}>();

const slots = useSlots();
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="fixed top-20 right-2 w-11/12 md:w-[520px]">
      <RuiAlert :type="type" :closeable="closeable" @close="emit('dismiss')">
        <template v-if="slots.title" #title>
          <slot name="title" />
        </template>
        <slot />
      </RuiAlert>
    </div>
  </Transition>
</template>
