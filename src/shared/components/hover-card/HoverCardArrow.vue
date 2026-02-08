<script setup lang="ts">
import { HoverCardArrow } from 'reka-ui'
</script>

<template>
  <HoverCardArrow v-bind="$attrs">
    <slot />
  </HoverCardArrow>
</template>
