<script lang="ts" setup>
import { commonAttrs, getMetadata } from '~/utils/metadata';
import { useMarkdownContent } from '~/composables/markdown';

const title = 'We’re looking for talented people';
const description =
  'Our mission is to empower users to take control of their finances both in and out of crypto in a transparent and auditable way while enabling them to own their data through a self-sovereign application.';

const {
  public: { baseUrl },
} = useRuntimeConfig();

useHead({
  title,
  meta: getMetadata(title, description, `${baseUrl}/jobs`, baseUrl),
  ...commonAttrs(),
});

const { groupedOpenJobsByCategory, loadJobs } = useMarkdownContent();

await loadJobs();

definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="jobs">
    <template #title>{{ title }}</template>
    <template #description>
      {{ description }}
    </template>
    <div class="py-8 lg:py-20">
      <div class="container">
        <div
          v-if="Object.keys(groupedOpenJobsByCategory).length > 0"
          class="space-y-8"
        >
          <div
            v-for="(jobs, category) in groupedOpenJobsByCategory"
            :key="category"
            class="space-y-6"
          >
            <div class="text-h6 font-medium">{{ category }}</div>
            <div class="space-y-6">
              <NuxtLink
                v-for="job in jobs"
                :key="job.title"
                class="block cursor-pointer"
                :to="job.link"
              >
                <div
                  class="p-4 rounded border border-rui-grey-300 space-y-4 hover:bg-rui-grey-100"
                >
                  <div class="text-body-1">
                    {{ job.title }}
                  </div>
                  <div class="text-body-2 text-rui-text-secondary">
                    {{ job.description }}
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-else>
          <TextParagraph>There are no open roles.</TextParagraph>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
