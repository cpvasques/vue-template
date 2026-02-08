<script setup lang="ts">
import { HoverCardRoot } from 'reka-ui'
</script>

<template>
  <HoverCardRoot v-bind="$attrs">
    <slot />
  </HoverCardRoot>
</template>
