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
        ' bg-white shadow-2xl transition-all duration-300 ease-in-out rounded-lg border-gray-300 bg-card text-black',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
