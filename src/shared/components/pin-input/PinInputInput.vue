<script setup lang="ts">
import {
  PinInputInput,
  type PinInputInputProps,
  useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<
  PinInputInputProps & {
    class?: HTMLAttributes['class']
    hasError?: boolean
    disabled?: boolean
  }
>()

const delegatedProps = computed(() => {
  const { class: _, disabled: __, ...delegated } = props
  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <PinInputInput
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex h-10 w-10 items-center justify-center text-center text-sm transition-all [&:has([data-selected])]:cursor-not-allowed',
        props.class,
        props.hasError && 'border-red-700',
        props.disabled &&
          'cursor-not-allowed! opacity-70 data-disabled:cursor-not-allowed!',
      )
    "
  />
</template>
