<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/utils/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="
      cn(
        'bg-card rounded-lg border-gray-300 bg-white text-black shadow-2xl transition-all duration-300 ease-in-out',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
