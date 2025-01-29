<script setup lang="ts">
import SidebarIcons from './SidebarIcons.vue'

interface RouteItem {
  name: string | null
  menuLabel: string | null
  path: string | null
}

defineProps<{
  route: RouteItem
  isExpanded: boolean
}>()
</script>

<template>
  <li :class="[isExpanded ? 'block' : 'hidden', 'md:block']">
    <router-link
      :to="route.path"
      class="flex h-12 items-center rounded-tr rounded-br pl-4 text-gray-800 transition-all duration-200 hover:bg-gray-200"
      :class="{ 'justify-between': isExpanded }"
      exact-active-class="bg-blue-500 text-white"
    >
      <span class="text-lg">
        <SidebarIcons :nav-name="route.name" />
      </span>

      <span v-if="isExpanded" class="ml-4 flex-1">
        {{ route.menuLabel }}
      </span>
    </router-link>
  </li>
</template>
