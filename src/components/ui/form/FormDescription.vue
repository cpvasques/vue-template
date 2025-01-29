<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import { cn } from '@/utils/cn'

import { useFormField } from './useFormField'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { formDescriptionId } = useFormField()
</script>

<template>
  <p :id="formDescriptionId" :class="cn('text-sm text-black', props.class)">
    <slot />
  </p>
</template>
