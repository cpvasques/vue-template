<script setup lang="ts">
import HamburgerButton from './HamburgerButton.vue'

const emit = defineEmits<{
  (event: 'hamburger-click'): void
}>()
</script>

<template>
  <div class="flex items-center">
    <HamburgerButton @click="emit('hamburger-click')" />
    <span class="hidden w-full text-xl font-bold sm:flex sm:text-center">LOGO</span>
  </div>
</template>
