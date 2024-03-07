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
import { computed } from "vue";
import SpinnerIcon from "./icons/SpinnerIcon.vue";

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
  setup(props) {
    // COMPUTED
    const containerClass = computed(() => ({
      "flex items-center justify-center min-h-[75vh]": props.fullScreen,
      "mt-1": props.isButton,
    }));

    return { containerClass };
  },
};
</script>
