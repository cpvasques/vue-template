<script setup lang="ts">
import { PhHouse, PhInfo } from '@phosphor-icons/vue'

defineProps<{
  navName: string
}>()
</script>

<template>
  <PhHouse v-if="navName === 'Home'" class="min-h-4.5 min-w-4.5" />
  <PhInfo v-if="navName === 'About'" class="min-h-4.5 min-w-4.5" />
</template>
