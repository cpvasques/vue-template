<template>
  <nav
    :class="{
      'w-60': isExpanded,
      'w-16': isWeb && !isExpanded,
      'w-0': !isWeb && !isExpanded,
      'w-3/5': !isWeb && isExpanded,
    }"
    class="relative overflow-visible bg-white min-h-screen shadow-xl transition-all duration-300 ease-in-out overflow-hidden"
  >
    <div class="flex-grow relative pt-12">
      <ul>
        <li v-for="route in navItems" :key="route.menuLabel" class="group">
          <router-link
            v-show="isWeb || isExpanded"
            :to="route.path"
            class="flex items-center h-12 text-gray-800 hover:bg-gray-200 rounded-tr rounded-br pl-4 transition-all duration-200"
            :class="{
              'justify-between': isExpanded,
            }"
            exact-active-class="bg-blue-500 text-white"
          >
            <span class="text-lg">
              <SidebarIcons :nav-name="route.name" />
            </span>
            <span v-if="isExpanded" class="flex-1 ml-4">
              {{ route.menuLabel }}
            </span>
          </router-link>
        </li>
      </ul>

      <button
        v-if="isWeb"
        class="absolute -right-3 top-0 mt-2 transition-transform duration-300"
        :class="{ 'rotate-180': isExpanded }"
        @click="toggleExpand"
      >
        <SidebarArrow />
      </button>
    </div>
  </nav>
</template>
<script>
import { routes } from "@/router";

import isWebMixin from "@/mixins/isWebMixin";
import SidebarArrow from "@/components/atoms/SvgIcons/SidebarArrow.vue";
import SidebarIcons from "@/components/molecules/SidebarIcons.vue";

export default {
  name: "Sidebar",
  components: {
    SidebarArrow,
    SidebarIcons,
  },
  mixins: [isWebMixin],
  data: () => ({
    navItems: [],
    isExpanded: false,
  }),
  created() {
    this.navItems = routes[0].children;
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>
