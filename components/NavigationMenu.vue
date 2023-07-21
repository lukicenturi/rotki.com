<script setup lang="ts">
import { RuiIcon } from '@rotki/ui-library';
</script>

<template>
  <div class="flex space-x-4 flex-wrap justify-center">
    <ButtonLink size="lg" to="/">Home</ButtonLink>
    <ButtonLink size="lg" to="/download">Download</ButtonLink>
    <ButtonLink size="lg" to="/jobs">Jobs</ButtonLink>
    <ButtonLink size="lg" to="/values">Values</ButtonLink>
    <ButtonLink size="lg" to="/features">Features</ButtonLink>
    <ButtonLink
      size="lg"
      to="https://rotki.readthedocs.io/en/latest/index.html"
      external
    >
      <span> Documentation </span>
      <template #append>
        <RuiIcon size="18" name="external-link-line" />
      </template>
    </ButtonLink>
    <ButtonLink size="lg" to="https://blog.rotki.com" external>
      <span> Blog </span>
      <template #append>
        <RuiIcon size="18" name="external-link-line" />
      </template>
    </ButtonLink>
  </div>
</template>
