<template>
  <button
    class="absolute -right-3 top-0 mt-2 transition-transform duration-300"
    :class="{ 'rotate-180': isExpanded }"
    @click="emitMethod"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "ToggleButton",
  props: {
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  methods: {
    emitMethod() {
      this.$emit("click");
    },
  },
};
</script>
