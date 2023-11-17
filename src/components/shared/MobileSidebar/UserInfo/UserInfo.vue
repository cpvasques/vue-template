<template>
  <div class="info">
    <div class="info-avatar" style=""></div>
    <div class="info-container">
      <span class="info-container__text">{{ userName }}</span>
      <span class="info-container__text">ADM</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAuthStore } from "@/stores/auth/auth";

export default {
  name: "UserInfo",
  computed: {
    ...mapState(useAuthStore, ["userInfo"]),
    userName() {
      return this.userInfo.name;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "UserInfo.scss";
</style>
