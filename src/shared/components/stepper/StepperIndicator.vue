<script lang="ts" setup>
import type { StepperIndicatorProps } from 'reka-ui'
import { StepperIndicator, useForwardProps } from 'reka-ui'
import { computed, defineProps, useAttrs, withDefaults } from 'vue'

import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    StepperIndicatorProps & {
      activeClass?: string
      completedClass?: string
      disabledClass?: string
      inactiveClass?: string
    }
  >(),
  {
    activeClass:
      'group-data-[state=active]:bg-black group-data-[state=active]:text-white',
    completedClass:
      'group-data-[state=completed]:bg-black group-data-[state=completed]:text-white',
    disabledClass:
      'group-data-[state=disabled]:bg-gray-500 group-data-[state=disabled]:text-gray-300',
    inactiveClass:
      'group-data-[state=inactive]:bg-gray-300 group-data-[state=inactive]:text-gray-500',
  },
)

const attrs = useAttrs()

const computedClasses = computed(() =>
  cn(
    'inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground/50',
    props.activeClass,
    props.completedClass,
    props.disabledClass,
    props.inactiveClass,
    attrs.class,
  ),
)

const forwarded = useForwardProps(computed(() => props))
</script>

<template>
  <StepperIndicator v-bind="forwarded" :class="computedClasses">
    <slot />
  </StepperIndicator>
</template>
