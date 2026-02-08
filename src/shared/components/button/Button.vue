<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

import { type ButtonVariants, buttonVariants } from '.'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  isLoading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="
      cn(buttonVariants({ variant, size }), props.class, {
        'pointer-events-none opacity-90': isLoading || disabled,
      })
    "
  >
    <LoaderCircle v-if="props.isLoading" class="mr-2 animate-spin" />
    <slot />
  </Primitive>
</template>
