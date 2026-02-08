<script setup lang="ts">
import { HoverCardPortal } from 'reka-ui'
</script>

<template>
  <HoverCardPortal v-bind="$attrs">
    <slot />
  </HoverCardPortal>
</template>
