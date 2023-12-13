<template>
  <button
    :id="id"
    :class="[
      { alert: hasAlert },
      { disabled: hasRequiredFields || isLoading },
      buttonClass,
    ]"
    @click="emitMethod"
  >
    <span v-if="!isLoading"> {{ label }} </span>
    <Loader v-else :color="'#fff'" :is-button="true" />
  </button>
</template>

<script>
import Loader from "./Loader.vue";

export default {
  name: "Button",
  components: {
    Loader,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "blue",
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

  computed: {
    buttonClass() {
      const baseClasses =
        "text-white font-bold py-2 px-4 rounded transition-all duration-400";
      const colorClasses = this.colorMap[this.color] || this.colorMap.default;
      const alertClasses = this.hasAlert ? "bg-red-500 hover:bg-red-700" : "";
      const disabledClasses =
        this.hasRequiredFields || this.isLoading
          ? "opacity-50 cursor-not-allowed"
          : "";

      return `${baseClasses} ${colorClasses} ${alertClasses} ${disabledClasses}`;
    },
    colorMap() {
      return {
        blue: "bg-blue-500 hover:bg-blue-700",
        red: "bg-red-500 hover:bg-red-700",
        green: "bg-green-500 hover:bg-green-700",
        default: "bg-gray-500 hover:bg-gray-700",
      };
    },
  },
  methods: {
    emitMethod() {
      this.$emit("emitMethod");
    },
  },
};
</script>
