<script setup lang="ts">
import { routes } from '@/app/providers/router'
import { cn } from '@/app/utils/cn'

import SidebarItem from './ui/SidebarItem.vue'

const navItems = ref<any[]>([])
const isExpanded = ref(false)

const sidebarClasses = computed(() =>
  cn(
    'relative min-h-screen border-r transition-all duration-300 ease-in-out',
    isExpanded.value ? 'w-2/5 xs:w-60' : 'w-0 sm:w-14',
  ),
)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

onMounted(() => {
  const children = routes[0]?.children ?? []

  navItems.value = children.filter((item) => item.meta && item.meta.render)
})

defineExpose({
  toggleExpand,
})
</script>

<template>
  <nav
    :class="cn('border-border bg-background overflow-hidden', sidebarClasses)"
  >
    <div class="relative max-h-[90vh] grow overflow-y-auto overflow-x-hidden pt-4">
      <ul>
        <SidebarItem
          v-for="(route, index) in navItems"
          :key="(route.meta?.menuLabel as string) || index"
          :route="route"
          :is-expanded="isExpanded"
        />
      </ul>
    </div>
  </nav>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 2px;
}

::-webkit-scrollbar-track {
  background-color: hsl(var(--secondary));
}

/* Handle */
::-webkit-scrollbar-thumb {
  background-color: hsl(var(--primary));
  border-radius: 1rem;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--primary));
}
</style>
