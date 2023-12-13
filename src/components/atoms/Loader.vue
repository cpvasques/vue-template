<template>
  <div :class="containerClass">
    <SpinnerIcon
      class="animate-spin"
      :color="color"
      :size="biggerIcon ? 60 : 20"
    />
  </div>
</template>

<script>
import SpinnerIcon from "./SvgIcons/SpinnerIcon.vue";

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
  computed: {
    containerClass() {
      return {
        "flex items-center justify-center min-h-[75vh]": this.fullScreen,
        "mt-1": this.isButton,
      };
    },
  },
};
</script>
