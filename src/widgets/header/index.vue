<script setup lang="ts">
import HeaderLogo from './ui/HeaderLogo.vue'
import HeaderProfile from './ui/HeaderProfile.vue'

const emit = defineEmits<{
  (event: 'hamburger-click'): void
}>()
</script>

<template>
  <header
    class="border-border bg-background flex items-center justify-between border-b p-4 transition-all duration-300 ease-out"
  >
    <HeaderLogo @hamburger-click="emit('hamburger-click')" />
    <HeaderProfile />
  </header>
</template>
