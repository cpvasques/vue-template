<template>
  <button
    :id="id"
    class="generic-button"
    :class="[{ alert: hasAlert }, { disabled: hasRequiredFields || isLoading }]"
    @click="emitMethod"
  >
    <span v-if="!isLoading" class="generic-button__label"> {{ label }}</span>
    <Loader v-else :color="'#fff'" :is-button="true" />
  </button>
</template>

<script>
import Loader from "@/components/shared/Loader/Loader.vue";

export default {
  name: "GenericCheckbox",
  components: {
    Loader,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    hasAlert: {
      type: Boolean,
      default: false,
    },
    hasRequiredFields: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["emitMethod"],
  methods: {
    emitMethod() {
      this.$emit("emitMethod");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "GenericButton.scss";
</style>
