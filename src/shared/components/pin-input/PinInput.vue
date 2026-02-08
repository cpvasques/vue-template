<script setup lang="ts">
import {
  PinInputRoot,
  type PinInputRootEmits,
  type PinInputRootProps,
  useForwardPropsEmits,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<
    PinInputRootProps & { class?: HTMLAttributes['class']; disabled?: boolean }
  >(),
  {
    modelValue: () => [],
  },
)
const emits = defineEmits<PinInputRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <PinInputRoot
    v-bind="forwarded"
    :class="cn('flex items-center gap-2', props.class)"
  >
    <slot />
  </PinInputRoot>
</template>
