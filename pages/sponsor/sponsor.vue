<script setup lang="ts">
import { get, set } from '@vueuse/core';
import { commonAttrs, getMetadata } from '~/utils/metadata';

const description = 'Sponsor rotki next release';

const {
  public: { baseUrl, openseaApiKey },
} = useRuntimeConfig();

useHead({
  title: 'Sponsor | rotki',
  meta: [
    ...getMetadata('Sponsor | rotki', description, baseUrl, `${baseUrl}/sponsor`),
  ],
  ...commonAttrs(),
});

definePageMeta({
  layout: 'sponsor',
});

const CONTRACT_ADDRESS = '0x281986c18a5680C149b95Fc15aa266b633B60e96';
const CHAIN = 'sepolia';

const tierMapping = {
  bronze: 'https://testnets.opensea.io/assets/sepolia/0x281986c18a5680C149b95Fc15aa266b633B60e96/0',
  silver: 'https://testnets.opensea.io/assets/sepolia/0x281986c18a5680C149b95Fc15aa266b633B60e96/0',
  gold: 'https://testnets.opensea.io/assets/sepolia/0x281986c18a5680C149b95Fc15aa266b633B60e96/0',
};

const tiers = [
  { key: 'bronze', label: 'Bronze', price: '0.1 ETH', tokenId: 0 },
  { key: 'silver', label: 'Silver', price: '0.25 ETH', tokenId: 0 },
  { key: 'gold', label: 'Gold', price: '0.5 ETH', tokenId: 0 },
];

const selectedTier = ref('bronze');
const nftImages = ref<Record<string, string>>({});
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchNFTMetadata(tokenId: number) {
  try {
    const url = `https://testnets-api.opensea.io/api/v2/chain/${CHAIN}/contract/${CONTRACT_ADDRESS}/nfts/${tokenId}`;

    const response = await fetch(url, {
      headers: {
        'X-API-KEY': openseaApiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenSea API error: ${response.status}`);
    }

    const data = await response.json();
    console.warn(`OpenSea API response for token ${tokenId}:`, data);

    // Try different possible image URL paths
    const imageUrl = data.nft?.display_image_url;

    console.warn(`Extracted image URL for token ${tokenId}:`, imageUrl);
    return imageUrl;
  }
  catch (error_) {
    console.error(`Error fetching NFT metadata for token ${tokenId}:`, error_);
    return null;
  }
}

async function loadNFTImages() {
  set(isLoading, true);
  set(error, null);

  try {
    const images: Record<string, string> = {};

    for (const tier of tiers) {
      const imageUrl = await fetchNFTMetadata(tier.tokenId);
      if (imageUrl) {
        images[tier.key] = imageUrl;
      }
    }

    console.warn('Final images object:', images);
    set(nftImages, images);
  }
  catch (error_) {
    set(error, 'Failed to load NFT images');
    console.error('Error loading NFT images:', error_);
  }
  finally {
    set(isLoading, false);
  }
}

function mintNFT() {
  window.open(tierMapping[get(selectedTier) as keyof typeof tierMapping], '_blank');
}

onMounted(() => {
  loadNFTImages();
});
</script>

<template>
  <div class="marketplace-container">
    <div class="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      <!-- NFT Image Section -->
      <div class="lg:w-1/2 flex justify-center">
        <div class="nft-image-container">
          <div class="aspect-square w-full max-w-md bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <div
              v-if="isLoading"
              class="text-gray-500 text-center"
            >
              <div class="animate-spin text-4xl mb-2">
                ⏳
              </div>
              <div class="text-lg font-medium">
                Loading NFT...
              </div>
            </div>
            <div
              v-else-if="error"
              class="text-red-500 text-center"
            >
              <div class="text-4xl mb-2">
                ❌
              </div>
              <div class="text-lg font-medium">
                Failed to load
              </div>
              <button
                class="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                @click="loadNFTImages()"
              >
                Retry
              </button>
            </div>
            <div
              v-else-if="nftImages[selectedTier]"
              class="w-full h-full"
            >
              <img
                :src="nftImages[selectedTier]"
                :alt="`${tiers.find(tier => tier.key === selectedTier)?.label} NFT`"
                class="w-full h-full object-cover rounded-lg"
                @error="console.warn('Image failed to load')"
              />
            </div>
            <div
              v-else
              class="text-gray-500 text-center"
            >
              <div class="text-4xl mb-2">
                🎨
              </div>
              <div class="text-lg font-medium">
                {{ tiers.find(tier => tier.key === selectedTier)?.label }} NFT
              </div>
              <div class="text-sm text-gray-400 mt-1">
                Image not available
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Options and Description Section -->
      <div class="lg:w-1/2">
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold mb-2">
              Sponsor rotki NFT Collection
            </h1>
            <p class="text-gray-600 mb-6">
              Support rotki development by minting exclusive NFTs. Each tier unlocks special benefits and shows your commitment to the project.
            </p>
          </div>

          <!-- Tier Selection -->
          <div class="space-y-4">
            <h3 class="text-xl font-semibold">
              Select Tier
            </h3>
            <div class="space-y-3">
              <div
                v-for="tier in tiers"
                :key="tier.key"
                class="tier-option"
                :class="{ selected: selectedTier === tier.key }"
                @click="selectedTier = tier.key"
              >
                <div class="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <div class="flex items-center space-x-3">
                    <input
                      :id="tier.key"
                      v-model="selectedTier"
                      :value="tier.key"
                      type="radio"
                      name="tier"
                      class="text-primary-600 focus:ring-primary-500"
                    />
                    <label
                      :for="tier.key"
                      class="font-medium cursor-pointer"
                    >
                      {{ tier.label }}
                    </label>
                  </div>
                  <div class="text-lg font-bold text-primary-600">
                    {{ tier.price }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mint Button -->
          <div class="pt-4">
            <RuiButton
              color="primary"
              size="lg"
              class="w-full"
              @click="mintNFT()"
            >
              <template #prepend>
                <RuiIcon name="lu-external-link" />
              </template>
              Mint {{ tiers.find(tier => tier.key === selectedTier)?.label }} NFT
            </RuiButton>
          </div>

          <!-- Additional Info -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold mb-2">
              What you get:
            </h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• Exclusive NFT artwork</li>
              <li>• Supporting rotki development</li>
              <li>• Special community recognition</li>
              <li>• Future holder benefits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
