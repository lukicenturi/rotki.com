<script lang="ts" setup>
const slots = useSlots();
</script>

<template>
  <NuxtLayout name="default">
    <div class="bg-rui-primary/[.04] py-12 lg:py-20">
      <div class="container">
        <div class="max-w-[768px]">
          <div class="mb-3">
            <ButtonLink to="/jobs" color="primary" inline>
              Careers at rotki
            </ButtonLink>
          </div>
          <div class="text-h4">
            <slot name="title" />
          </div>
          <div v-if="slots.description" class="mt-5 body-1">
            <slot name="description" />
          </div>
        </div>
      </div>
    </div>
    <slot />
    <template #footer>
      <PageFooter landing />
    </template>
  </NuxtLayout>
</template>
