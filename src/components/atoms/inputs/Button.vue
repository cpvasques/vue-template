<template>
  <button
    :id="id"
    :class="[
      { alert: hasAlert },
      { disabled: disabled || isLoading },
      buttonClass,
    ]"
    @click="click"
  >
    <span v-if="!isLoading"> {{ label }} </span>
    <Loader v-else :color="'#fff'" :is-button="true" />
  </button>
</template>

<script>
import { computed } from "vue";
import Loader from "@/components/atoms/utils/Loader.vue";

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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    // METHODS
    const emitMethod = () => {
      emit("click");
    };

    const colorMap = {
      blue: "bg-blue-500 hover:bg-blue-700",
      red: "bg-red-500 hover:bg-red-700",
      green: "bg-green-500 hover:bg-green-700",
      default: "bg-gray-500 hover:bg-gray-700",
    };

    // COMPUTED
    const buttonClass = computed(() => {
      const baseClasses =
        "flex justify-center align-center text-white font-bold py-2 px-4 rounded transition-all duration-400";
      const colorClasses = colorMap[props.color] || colorMap.default;
      const alertClasses = props.hasAlert ? "bg-red-500 hover:bg-red-700" : "";
      const disabledClasses =
        props.disabled || props.isLoading
          ? "opacity-50 cursor-not-allowed disabled:pointer-events-none"
          : "";

      return `${baseClasses} ${colorClasses} ${alertClasses} ${disabledClasses}`;
    });

    return { emitMethod, buttonClass };
  },
};
</script>
