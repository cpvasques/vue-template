<script setup lang="ts">
import HeaderLogo from './HeaderLogo.vue'
import HeaderProfile from './HeaderProfile.vue'

const emit = defineEmits<{
  (event: 'hamburger-click'): void
}>()
</script>

<template>
  <header class="flex items-center justify-between bg-white p-4 shadow-md">
    <HeaderLogo @hamburger-click="emit('hamburger-click')" />
    <HeaderProfile />
  </header>
</template>
