<script setup lang="ts">
import { RuiButton, RuiIcon } from '@rotki/ui-library';
</script>

<template>
  <div class="flex space-x-4 flex-wrap justify-center">
    <NuxtLink to="/">
      <RuiButton variant="text" size="lg"> Home </RuiButton>
    </NuxtLink>
    <NuxtLink to="/download">
      <RuiButton variant="text" size="lg"> Download </RuiButton>
    </NuxtLink>
    <NuxtLink to="/jobs">
      <RuiButton variant="text" size="lg"> Jobs </RuiButton>
    </NuxtLink>
    <NuxtLink to="/values">
      <RuiButton variant="text" size="lg"> Values </RuiButton>
    </NuxtLink>
    <NuxtLink to="/features">
      <RuiButton variant="text" size="lg"> Features </RuiButton>
    </NuxtLink>
    <a
      href="https://rotki.readthedocs.io/en/latest/index.html"
      rel="noreferrer"
      target="_blank"
    >
      <RuiButton variant="text" size="lg">
        Documentation
        <template #append>
          <RuiIcon name="external-link-line" />
        </template>
      </RuiButton>
    </a>
    <a href="https://blog.rotki.com/" rel="noreferrer" target="_blank">
      <RuiButton variant="text" size="lg">
        Blog
        <template #append>
          <RuiIcon name="external-link-line" />
        </template>
      </RuiButton>
    </a>
  </div>
</template>
