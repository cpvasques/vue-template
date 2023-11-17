<template>
  <header class="header">
    <div class="header-container">
      <div class="header-container__menu" @click="handleMobileSidebar">
        <MobileSidebarIcon />
      </div>
    </div>
  </header>
</template>

<script>
import MobileSidebarIcon from "@/components/shared/Icons/MobileSidebarIcon.vue";

export default {
  name: "MobileHeader",
  components: {
    MobileSidebarIcon,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["handleMobileSidebar"],
  methods: {
    handleMobileSidebar() {
      this.$emit("handleMobileSidebar", !this.isOpen);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "MobileHeader.scss";
</style>
