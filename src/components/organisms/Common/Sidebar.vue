<template>
  <nav :class="sidebarClasses">
    <div class="relative flex-grow pt-12">
      <ul>
        <NavItem
          v-for="route in navItems"
          :key="route.menuLabel"
          :route="route"
          :is-expanded="isExpanded"
          :show-nav="isExpanded || isWeb"
        />
      </ul>

      <ToggleButton
        v-if="isWeb"
        :is-expanded="isExpanded"
        @click="toggleExpand"
      >
        <SidebarArrow />
      </ToggleButton>
    </div>
  </nav>
</template>

<script>
import { routes } from "@/router";

import isWebMixin from "@/mixins/isWebMixin";
import NavItem from "@/components/molecules/common/NavItem.vue";
import ToggleButton from "@/components/atoms/inputs/ToggleButton.vue";
import SidebarArrow from "@/components/atoms/icons/SidebarArrow.vue";

export default {
  name: "Sidebar",
  components: {
    NavItem,
    ToggleButton,
    SidebarArrow,
  },
  mixins: [isWebMixin],
  data: () => ({
    navItems: [],
    isExpanded: false,
  }),
  computed: {
    sidebarClasses() {
      return {
        "w-60": this.isExpanded,
        "w-16": this.isWeb && !this.isExpanded,
        "w-0": !this.isWeb && !this.isExpanded,
        "w-3/5": !this.isWeb && this.isExpanded,
        "relative min-h-screen overflow-hidden overflow-visible bg-white shadow-xl transition-all duration-300 ease-in-out": true,
      };
    },
  },
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
