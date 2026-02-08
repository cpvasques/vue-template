<script setup lang="ts">
import {
  HoverCardTrigger,
  type HoverCardTriggerProps,
  useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<
  HoverCardTriggerProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <HoverCardTrigger v-bind="forwardedProps" :class="cn(props.class)">
    <slot />
  </HoverCardTrigger>
</template>
