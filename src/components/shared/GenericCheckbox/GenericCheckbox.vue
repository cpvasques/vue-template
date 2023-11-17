<template>
  <div class="generic-checkbox">
    <input
      :id="id"
      type="checkbox"
      class="generic-checkbox__input"
      :checked="modelValue"
      @change="emitValue($event.target.checked)"
    />
    <label :for="id" class="generic-checkbox__label">
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: "GenericCheckbox",
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

<style lang="scss" scoped>
@import "GenericCheckbox.scss";
</style>
