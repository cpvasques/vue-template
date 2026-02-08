<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

import SidebarIcons from './SidebarIcons.vue'

defineProps<{
  route: RouteRecordRaw
  isExpanded: boolean
}>()
</script>

<template>
  <li :class="[isExpanded ? 'block' : 'hidden', 'sm:block']">
    <router-link :to="route.path || ''" custom v-slot="{ navigate, isActive }">
      <a
        @click="navigate"
        class="mx-2 mb-2 flex h-9 cursor-pointer items-center rounded-md rounded-br transition-all duration-200"
        :class="[
          isExpanded ? 'gap-3 pl-3' : 'w-10 justify-center',
          isActive
            ? 'bg-primary text-secondary hover:bg-accent-foreground'
            : 'bg-background text-foreground hover:bg-primary hover:text-background',
        ]"
      >
        <span class="text-lg">
          <SidebarIcons :nav-name="(route?.meta?.menuLabel as string) || ''" />
        </span>
        <span v-if="isExpanded" class="flex-1">
          {{ route?.meta?.menuLabel || 'Erro ao gerar label' }}
        </span>
      </a>
    </router-link>
  </li>
</template>
