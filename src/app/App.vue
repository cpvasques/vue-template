<script setup lang="ts">
import { Toaster } from 'vue-sonner'

import { useThemeStore } from '@/shared/store/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initDarkMode()
})
</script>

<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>

    <Toaster
      data-testid="toasters"
      position="top-right"
      rich-colors
      :expand="true"
    />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  @apply transition-opacity duration-300;
}

.page-enter-from {
  @apply opacity-0;
}

.page-leave-to {
  @apply opacity-0;
}
</style>
