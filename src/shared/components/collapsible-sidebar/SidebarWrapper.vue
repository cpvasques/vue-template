<template>
  <div
    :style="{
      '--sidebar-width': SIDEBAR_WIDTH,
      '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
    }"
    :class="
      cn(
        'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
        props.class || '',
      )
    "
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>
