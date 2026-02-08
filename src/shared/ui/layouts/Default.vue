<script setup lang="ts">
import Header from '@/widgets/header/index.vue'
import Sidebar from '@/widgets/sidebar/index.vue'

interface SidebarRef {
  toggleExpand: () => void
}

const sidebar = ref<SidebarRef | null>(null)

const toggleExpand = () => {
  sidebar.value?.toggleExpand()
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header @hamburger-click="toggleExpand" />
    <div class="flex min-h-0 grow">
      <Sidebar ref="sidebar" />
      <main
        class="grow flex-wrap overflow-hidden bg-white sm:overflow-auto sm:px-4 sm:py-5 dark:bg-black"
      >
        <router-view v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </main>
    </div>
  </div>
</template>
