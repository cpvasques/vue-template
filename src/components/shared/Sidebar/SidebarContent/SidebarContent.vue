<template>
  <nav>
    <ul class="sidebar-content">
      <div
        v-for="route in navItems"
        :key="route.menuLabel"
        class="sidebar-content__holder"
      >
        <transition-group :key="`transition-${route.menuLabel}`" name="fade">
          <router-link
            :key="route.menuLabel"
            :to="route.path"
            class="sidebar-content__item"
          >
            <div class="sidebar-content__icon">
              <SidebarIcons :nav-name="route.name" />
            </div>
            <p class="sidebar-content__label">
              {{ route.menuLabel }}
            </p>
          </router-link>
        </transition-group>
      </div>
    </ul>
  </nav>
</template>

<script>
import { routes } from "@/router";
import SidebarIcons from "../SidebarIcons/SidebarIcons.vue";

export default {
  name: "SidebarContent",
  components: {
    SidebarIcons,
  },
  data: () => ({
    navItems: [],
  }),
  created() {
    this.navItems = routes[0].children;
  },
};
</script>

<style lang="scss">
@import "SidebarContent.scss";
</style>
