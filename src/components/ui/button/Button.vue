<script setup lang="ts">
import { PhSpinnerGap } from '@phosphor-icons/vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/utils/cn'

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
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :disabled="props.isLoading || props.disabled"
  >
    <PhSpinnerGap v-if="props.isLoading" class="mr-2 animate-spin" size="20" />
    <slot />
  </Primitive>
</template>
