<template>
  <li v-show="showNav">
    <router-link
      :to="route.path"
      class="flex h-12 items-center rounded-br rounded-tr pl-4 text-gray-800 transition-all duration-200 hover:bg-gray-200"
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

<script>
import SidebarIcons from "@/components/molecules/common/SidebarIcons.vue";

export default {
  name: "NavItem",
  components: {
    SidebarIcons,
  },
  props: {
    route: {
      type: Object,
      default: () => ({ name: null, menuLabel: null, path: null }),
    },
    isExpanded: Boolean,
    showNav: Boolean,
  },
};
</script>
