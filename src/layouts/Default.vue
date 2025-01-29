<script setup lang="ts">
import Header from '@/components/shared/Header/index.vue'
import PageLoader from '@/components/shared/PageLoader/index.vue'
import Sidebar from '@/components/shared/Sidebar/index.vue'
import { useLoaderStore } from '@/stores/loader'

const loader = useLoaderStore()

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
    <div class="flex min-h-0 flex-grow">
      <Sidebar ref="sidebar" />
      <main class="flex-grow px-8 py-4">
        <router-view v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </main>
    </div>
    <PageLoader v-if="loader.loading" />
  </div>
</template>
