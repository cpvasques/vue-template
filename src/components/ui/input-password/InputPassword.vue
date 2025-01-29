<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'

const props = defineProps<{
  modelValue?: string | undefined
  placeholder?: string
  disabled?: boolean
  hasError?: boolean
  iconVariant?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

import { cn } from '@/utils/cn'

const modelValue = useVModel(props, 'modelValue', emit, {
  passive: true,
})

const showPassword = ref(false)

const isDisabled = computed(() => {
  return !props.modelValue || props.disabled
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="relative">
    <input
      v-model="modelValue"
      :type="showPassword ? 'text' : 'password'"
      :disabled="disabled"
      :class="
        cn(
          'flex h-10 w-full rounded-sm border border-input bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          props.hasError && 'border-red-700',
        )
      "
      :placeholder="placeholder"
    />
    <button
      type="button"
      class="absolute right-0 top-0 h-full cursor-pointer px-3 py-2 hover:bg-transparent"
      :disabled="isDisabled"
      @click="togglePasswordVisibility"
    >
      <component
        :is="showPassword && !isDisabled ? EyeIcon : EyeOffIcon"
        class="h-4 w-4"
        aria-hidden="true"
      />
      <span class="sr-only">
        {{ showPassword ? 'Hide password' : 'Show password' }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.hide-password-toggle::-ms-reveal,
.hide-password-toggle::-ms-clear {
  visibility: hidden;
  pointer-events: none;
  display: none;
}
</style>
