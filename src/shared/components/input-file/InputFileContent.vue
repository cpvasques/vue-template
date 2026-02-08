<script setup lang="ts">
import { type HTMLAttributes, inject } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
const hasEmpty = inject('hasEmpty')
</script>

<template>
  <div v-show="!hasEmpty" :class="cn('flex items-center gap-5', props.class)">
    <slot />
  </div>
</template>
