<template>
  <div :class="[{ fullScreen: fullScreen }, { isButton: isButton }]">
    <SpinnerIcon :color="color" :size="biggerIcon ? 60 : 32" />
  </div>
</template>

<script>
import SpinnerIcon from "@/components/shared/Icons/SpinnerIcon.vue";

export default {
  name: "Loader",
  components: { SpinnerIcon },
  props: {
    fullScreen: {
      type: Boolean,
      default: false,
    },
    biggerIcon: {
      type: Boolean,
      default: false,
    },
    isButton: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#3a7ece",
    },
  },
};
</script>

<style lang="scss" scoped>
@import "Loader.scss";
</style>
