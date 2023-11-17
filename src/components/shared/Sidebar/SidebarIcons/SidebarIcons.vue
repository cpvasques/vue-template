<template>
  <ControlPanel v-if="navName == 'Home'" class="sidebar-icon" />
</template>

<script>
import ControlPanel from "@/components/shared/Icons/SidebarIcons/ControlPanel.vue";

export default {
  name: "SidebarIcons",
  components: {
    ControlPanel,
  },
  props: {
    navName: {
      type: String,
      default: null,
    },
    isActive: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="scss">
@import "SidebarIcons.scss";
</style>
