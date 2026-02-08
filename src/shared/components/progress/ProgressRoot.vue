<script setup lang="ts">
import { ProgressRoot } from 'reka-ui'
</script>

<template>
  <ProgressRoot v-bind="$attrs">
    <slot />
  </ProgressRoot>
</template>
