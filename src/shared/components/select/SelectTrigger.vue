<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import {
  SelectIcon,
  SelectTrigger,
  type SelectTriggerProps,
  useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes, inject, type Ref } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<
  SelectTriggerProps & {
    class?: HTMLAttributes['class']
    hasError?: boolean
    placeholder?: string
    value?: string
  }
>()

const isOpen = inject<Ref<boolean, boolean>>('isOpen')

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-start text-sm ring-offset-background focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground [&>span]:truncate',
        isOpen && 'outline-none',
        props.class,
        props.hasError && 'border-red-700',
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="h-4 w-4 shrink-0 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
