<script setup lang="ts">
import { useColorMode } from '@vueuse/core'

import { Switch } from '@/shared/components/switch'

const props = withDefaults(
  defineProps<{
    darkLabel?: string
    lightLabel?: string
  }>(),
  {
    darkLabel: 'Dark Theme',
    lightLabel: 'Light Theme',
  },
)

const mode = useColorMode({})

const isDark = computed<boolean>({
  get: () => mode.value === 'dark',
  set: (value: boolean) => {
    mode.value = value ? 'dark' : 'light'
  },
})

const currentLabel = computed(() =>
  isDark.value ? props.darkLabel : props.lightLabel,
)
</script>

<template>
  <div class="flex items-center space-x-2">
    <Switch v-model="isDark" id="theme-toggle" />
    <span class="ml-2">{{ currentLabel }}</span>
  </div>
</template>
