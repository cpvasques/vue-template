<script setup lang="ts">
import { ContextMenuItemIndicator } from 'reka-ui'
</script>

<template>
  <ContextMenuItemIndicator v-bind="$attrs">
    <slot />
  </ContextMenuItemIndicator>
</template>
