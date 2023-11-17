<template>
  <div class="sidebar" :class="{ open: isOpen, close: !isOpen }">
    <div class="sidebar__icon" @click="handleWebSidebar">
      <SidebarIcon />
    </div>
    <div class="sidebar__content">
      <SidebarContent :is-open="isOpen" @handleWebSidebar="handleWebSidebar" />
    </div>
  </div>
</template>

<script>
import SidebarContent from "@/components/shared/Sidebar/SidebarContent/SidebarContent.vue";
import SidebarIcon from "@/components/shared/Icons/SidebarIcon.vue";

export default {
  name: "Sidebar",
  components: { SidebarContent, SidebarIcon },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["handleWebSidebar"],
  methods: {
    handleWebSidebar() {
      this.$emit("handleWebSidebar");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "Sidebar.scss";
</style>
