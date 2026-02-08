<script setup lang="ts">
import { ChevronsLeft } from 'lucide-vue-next'
import { PaginationFirst, type PaginationFirstProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

import { Button } from '@/shared/components/button'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<PaginationFirstProps & { class?: HTMLAttributes['class'] }>(),
  {
    asChild: true,
  },
)

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <PaginationFirst v-bind="delegatedProps">
    <Button :class="cn('h-10 w-10 p-0', props.class)" variant="outline">
      <slot>
        <ChevronsLeft class="h-4 w-4" />
      </slot>
    </Button>
  </PaginationFirst>
</template>
