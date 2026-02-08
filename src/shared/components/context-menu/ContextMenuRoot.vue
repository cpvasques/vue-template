<script setup lang="ts">
import { ContextMenuRoot } from 'reka-ui'
</script>

<template>
  <ContextMenuRoot v-bind="$attrs">
    <slot />
  </ContextMenuRoot>
</template>
