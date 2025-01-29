<script setup lang="ts">
import { PhCaretRight } from '@phosphor-icons/vue'

import { routes } from '@/router'

import SidebarItem from './SidebarItem.vue'
import SidebarToggle from './SidebarToggle.vue'

const navItems = ref<any[]>([])
const isExpanded = ref(false)

const sidebarClasses = computed(() => ({
  'w-60': isExpanded.value,
  'md:w-16': !isExpanded.value,
  'w-0': !isExpanded.value,
  'w-3/5': isExpanded.value && 'sm',
  'relative min-h-screen overflow-hidden overflow-visible bg-white shadow-xl transition-all duration-300 ease-in-out':
    true,
}))

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

onMounted(() => {
  navItems.value = routes[0].children ?? []
})

defineExpose({
  toggleExpand,
})
</script>

<template>
  <nav :class="sidebarClasses">
    <div class="relative flex-grow pt-12">
      <ul>
        <SidebarItem
          v-for="route in navItems"
          :key="route.menuLabel"
          :route="route"
          :is-expanded="isExpanded"
        />
      </ul>

      <SidebarToggle class="hidden md:block" :is-expanded="isExpanded" @click="toggleExpand">
        <PhCaretRight class="text-white" />
      </SidebarToggle>
    </div>
  </nav>
</template>
