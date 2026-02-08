<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'

const props = defineProps<{
  password: string
}>()

const hasMinLength = computed(() => (props.password?.length || 0) >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(props.password || ''))
const hasLowercase = computed(() => /[a-z]/.test(props.password || ''))
const hasNumbers = computed(() => /[0-9]/.test(props.password || ''))
const hasSpecialChars = computed(() => /[@#&*]/.test(props.password || ''))

const passwordRules = [
  {
    text: 'No mínimo 8 caracteres',
    isValid: hasMinLength,
  },
  {
    text: 'Letra maiúscula (A-Z)',
    isValid: hasUppercase,
  },
  {
    text: 'Letra minúscula (a-z)',
    isValid: hasLowercase,
  },
  {
    text: 'Números (0-9)',
    isValid: hasNumbers,
  },
  {
    text: 'Caracteres especiais (@#&*)',
    isValid: hasSpecialChars,
  },
]
</script>

<template>
  <div class="mt-8! -space-y-1 text-sm">
    <div
      v-for="(rule, index) in passwordRules"
      :key="index"
      class="flex items-center"
    >
      <component
        :is="rule.isValid.value ? Check : X"
        class="mr-2 h-3 w-3"
        :class="rule.isValid.value ? 'text-emerald-500' : 'text-red-600'"
        stroke-width="3"
      />
      <span
        class="text-sm"
        :class="rule.isValid.value ? 'text-emerald-500' : 'text-red-600'"
      >
        {{ rule.text }}
      </span>
    </div>
  </div>
</template>
