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
      class="cursor-pointer text-blue-600 font-semibold text-sm flex items-center"
    >
      <span
        class="h-4 w-4 mr-2 border-2 border-blue-600 rounded-sm bg-white flex items-center justify-center"
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
  data: () => ({}),
  methods: {
    emitValue(newValue) {
      this.$emit("update:modelValue", newValue);
    },
  },
};
</script>
