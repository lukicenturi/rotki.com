<script lang="ts" setup>
import type { DownloadItem, DownloadItemSingle } from '~/types/download';

const props = defineProps<{ version: string; links: DownloadItem[] }>();
const { t } = useI18n({ useScope: 'global' });

const showAll = ref(false);

const sponsors = [
  {
    name: 'Lefteris Karapetsas',
    image: 'https://avatars.githubusercontent.com/u/1658405?v=4',
  },
  {
    name: 'DataLorge Solutions',
    image: 'https://placehold.co/150x150/1F2937/FFFFFF?text=DataLorge&font=playfair-display',
  },
  {
    name: 'Michael Rodriguez',
    image: 'https://avatars.githubusercontent.com/u/5394839?v=4',
  },
  {
    name: 'CryptoFlow Labs',
    image: 'https://placehold.co/150x150/10B981/FFFFFF?text=CF.&font=Lora',
  },
  {
    name: 'Alex Kumar',
    image: 'https://avatars.githubusercontent.com/u/12312313?v=4',
  },
  {
    name: 'Julia Martinez',
    image: 'https://avatars.githubusercontent.com/u/12313144?v=4',
  },
  {
    name: 'Quantum Labs',
    image: 'https://placehold.co/150x150/F59E0B/1F2937?text=QLabs&font=Oswald',
  },
  {
    name: 'Sophie Dubois',
    image: 'https://avatars.githubusercontent.com/u/123128?v=4',
  },
];

function getOS() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('win'))
    return 'WINDOWS';
  if (userAgent.includes('mac'))
    return 'MAC';
  if (userAgent.includes('linux'))
    return 'LINUX';

  return 'WINDOWS';
}

const highlightedDownloadItem = computed<DownloadItemSingle[]>(() => {
  const found = props.links.find(item => item.platform === getOS());
  if (!found)
    return [];

  if ('group' in found) {
    return found.items.map(item => ({
      icon: found.icon,
      url: item.url,
      platform: item.name,
    }));
  }

  return [found];
});
</script>

<template>
  <div class="py-10 lg:py-20">
    <div class="container flex flex-col">
      <div class="flex flex-col items-start gap-y-4">
        <h6 class="text-rui-light-primary text-h6 font-medium">
          {{ t('download.heading.download_rotki') }}
        </h6>
        <h3 class="text-rui-text text-h4">
          {{ t('download.heading.description') }}
        </h3>
        <div class="flex flex-col items-start gap-3 pt-2">
          <ClientOnly>
            <div class="flex gap-2 flex-wrap">
              <ButtonLink
                v-for="item in highlightedDownloadItem"
                :key="item.url"
                :to="item.url"
                rounded
                color="primary"
                variant="default"
                size="lg"
                data-cy="main-download-button"
              >
                <template #prepend>
                  <RuiIcon
                    v-if="item.icon"
                    :name="item.icon"
                    size="20"
                  />
                  <img
                    v-else-if="item.image"
                    :src="item.image"
                    :alt="item.platform"
                    class="brightness-0 invert"
                    size="20px"
                  />
                </template>
                {{ t('download.download_for', { platform: item.platform }) }}
              </ButtonLink>
            </div>
            <template #fallback>
              <div class="h-[42px]" />
            </template>
          </ClientOnly>

          <div class="pl-1">
            <RuiButton
              size="sm"
              variant="text"
              color="primary"
              class="!p-0 !text-sm underline"
              data-cy="show-all-download"
              @click="showAll = true"
            >
              {{ t('download.download_for_other_os') }}
            </RuiButton>

            <p class="text-sm text-rui-text-secondary">
              {{ t('download.latest_release') }}: {{ version }}
            </p>
          </div>
        </div>
      </div>

      <RuiAccordions :model-value="showAll ? [0] : []">
        <RuiAccordion eager>
          <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 pt-8 md:pt-16 pb-6">
            <DownloadItem
              v-for="(link, i) in links"
              :key="i"
              :data="link"
              class="w-full"
            />
          </div>
        </RuiAccordion>
      </RuiAccordions>

      <div class="flex items-center mt-6 gap-12">
        <div class="flex flex-col mb-4 w-[150px]">
          <img
            src="https://photoai.com/assets/laurel.svg"
            class="w-full"
          />
          <div class="text-center -mt-11 text-sm">
            <div>This release</div>
            <div class="text-rui-text-secondary">
              Sponsored by:
            </div>
          </div>
        </div>
        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <div
            v-for="(sponsor, index) in sponsors"
            :key="index"
            class="flex flex-col gap-3"
          >
            <img
              class="size-12 min-w-12 rounded-md overflow-hidden"
              :src="sponsor.image"
              :alt="sponsor.name"
            />
            <div class="flex flex-col justify-between">
              <div class="uppercase text-sm font-bold text-left leading-5 text-rui-text-secondary">
                {{ sponsor.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
