<template>
  <header class="header">
    <div class="header-container">
      <div class="header-container__title">Logo</div>
      <div class="header-container__action">
        <UserInfo class="header-container__action--icon" />
      </div>
    </div>
  </header>
</template>

<script>
import UserInfo from "@/components/shared/Header/UserInfo/UserInfo.vue";

export default {
  name: "Header",
  components: {
    UserInfo,
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
@import "Header.scss";
</style>
