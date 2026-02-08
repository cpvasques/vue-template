<script setup lang="ts">
import {
  ProgressIndicator,
  type ProgressIndicatorProps,
  useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<
  ProgressIndicatorProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <ProgressIndicator
    :class="
      cn(
        'indicator ease-[cubic-bezier(0.65, 0, 0.35, 1)] relative block overflow-hidden transition-transform duration-500 after:absolute after:inset-0 after:animate-progress',
        props.class,
      )
    "
    v-bind="forwardedProps"
  >
    <slot />
  </ProgressIndicator>
</template>
