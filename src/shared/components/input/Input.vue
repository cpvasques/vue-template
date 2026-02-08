<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

import { useMask } from './useMask'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  document?: boolean
  cpf?: boolean
  cnpj?: boolean
  hasError?: boolean
  readonly?: boolean
  monetary?: boolean
  disabled?: boolean
  placeholder?: string
  type?: string
  hasIcon?: boolean
  maxLength?: number
  date?: boolean
  phone?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const {
  handleDocumentMask,
  handlePhoneMask,
  handleCpfMask,
  handleCnpjMask,
  handleDateMask,
  handleMonetaryMask,
} = useMask()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const inputRef = ref(null)
const inputId = ref(`input-${Math.random().toString(36).substring(2, 15)}`)
const { focused } = useFocus(inputRef)

const handleFocus = () => (focused.value = true)

onMounted(() => {
  if (props.document) handleDocumentMask(inputRef)
  if (props.cpf) handleCpfMask(inputRef)
  if (props.cnpj) handleCnpjMask(inputRef)
  if (props.date) handleDateMask(inputRef)
  if (props.phone) handlePhoneMask(inputRef)
  if (props.monetary) handleMonetaryMask(inputRef)
})

const rawValue = computed(() => {
  if (props.monetary && modelValue.value) {
    return Number(String(modelValue.value).replace(/\D/g, '')) / 100
  }
  return modelValue.value
})

defineExpose({
  handleFocus,
  rawValue: rawValue.value,
})
</script>

<template>
  <div
    :class="[
      'relative',
      cn(
        'flex h-10 w-full rounded-md border border-input bg-background text-sm disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
        props.hasError && 'border-red-700',
        props.hasIcon && 'pr-10',
      ),
    ]"
  >
    <input
      :id="inputId"
      ref="inputRef"
      v-model="modelValue"
      class="w-full border-inherit bg-transparent px-2 py-3 text-inherit ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      :maxlength="props.maxLength"
      :type="type || 'text'"
      :placeholder="placeholder"
      :disabled="props.readonly || props.disabled"
    />
    <div
      v-if="props.hasIcon"
      class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transform"
    >
      <slot name="icon" />
    </div>
  </div>
</template>
