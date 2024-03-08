<template>
  <div class="flex items-center">
    <input
      :id="id"
      type="checkbox"
      class="hidden"
      :checked="modelValue"
      @change="emitValue($event.target.checked)"
    />
    <label
      :for="id"
      class="flex cursor-pointer items-center text-sm font-semibold text-blue-600"
    >
      <span
        class="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border-2 border-blue-600 bg-white"
        :class="{ 'bg-blue-600': modelValue }"
      >
        <!-- Checkmark icon (when checkbox is checked) -->
        <svg
          v-show="modelValue"
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: "Checkbox",
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
    modelValue: {
      required: true,
      type: Boolean,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    // METHODS
    const emitValue = (newValue) => {
      emit("update:modelValue", newValue);
    };

    return { emitValue };
  },
};
</script>
