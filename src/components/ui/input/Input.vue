<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/utils/cn'
import { getParentBackgroundColor } from '@/utils/getParentBackgroundColor'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  hasError?: boolean
  readonly?: boolean
  placeholder?: string
  type?: string
  hasIcon?: boolean
  hasOwnLabel?: boolean
  maxLength?: number
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const inputRef = ref(null)
const inputId = ref(`input-${Math.random().toString(36).substring(2, 15)}`)

const isLabelActive = computed(() => !!modelValue.value || modelValue.value === 0)

const parentBackgroundColor = computed(() => getParentBackgroundColor(inputRef))
</script>

<template>
  <div class="relative w-full">
    <input
      :id="inputId"
      ref="inputRef"
      v-model="modelValue"
      :maxlength="props.maxLength"
      :type="type || 'text'"
      :class="
        cn(
          'peer border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:border-ppt-blue flex h-10 w-full rounded-sm border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-base file:font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          props.class,
          props.hasError && 'border-ppt-red-700',
          props.readonly && 'pointer-events-none opacity-50',
        )
      "
      :style="{ backgroundColor: parentBackgroundColor }"
      :placeholder="placeholder && !hasOwnLabel ? ' ' : placeholder"
      :disabled="props.readonly"
    />
    <label
      v-if="placeholder && !hasOwnLabel"
      :for="inputId"
      :class="
        cn(
          'peer-focus:text-ppt-blue peer-focus:dark:text-ppt-blue absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-inherit px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:!ml-0 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-gray-900 dark:text-gray-400',
          props.hasIcon && !isLabelActive && 'ml-8',
        )
      "
      :style="{ backgroundColor: parentBackgroundColor }"
    >
      {{ placeholder || '' }}
    </label>
  </div>
</template>
