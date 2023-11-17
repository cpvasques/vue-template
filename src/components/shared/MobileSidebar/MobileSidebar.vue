<template>
  <div class="sidebar" :class="{ open: isOpen, close: !isOpen }">
    <div v-click-outside="handleOutsideClick" class="sidebar__content">
      <SidebarContent :is-open="isOpen" :is-mobile="true" />
    </div>
  </div>
</template>

<script>
import SidebarContent from "@/components/shared/Sidebar/SidebarContent/SidebarContent.vue";

export default {
  name: "MobileSidebar",
  components: { SidebarContent },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["handleMobileSidebar"],
  methods: {
    handleOutsideClick() {
      this.$emit("handleMobileSidebar", false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "MobileSidebar.scss";
</style>
