<template>
  <div class="relative mb-2 w-full">
    <Label
      :id="id"
      :for="id"
      class="text-sm font-bold"
      :class="[{ 'text-red-500 ': isRequired }]"
    >
      {{ label }}
    </Label>
    <InputField
      :id="id"
      :type="!isPassword ? type : passwordType"
      :placeholder="placeholder"
      :is-required="isRequired"
      :value="modelValue"
      @update:value="emitValue"
      @focus="handleFocus(true)"
      @blur="handleFocus(false)"
    />
    <div
      v-if="isPassword"
      class="absolute right-2.5 top-8 cursor-pointer"
      @click="handleShowPassword"
    >
      <ClosedEyeIcon v-if="passwordType === 'text'" :color="iconColor" />
      <EyeIcon v-else :color="iconColor" />
    </div>
    <div v-if="errorMessage && showErrorMessage" class="mt-1 flex items-center">
      <WarningIcon />
      <span class="ml-1 text-sm font-normal leading-4 text-red-500">
        {{ errorMessage }}
      </span>
    </div>
  </div>
</template>

<script>
import Label from "../atoms/Label.vue";
import InputField from "../atoms/InputField.vue";
import EyeIcon from "../atoms/icons/EyeIcon.vue";
import ClosedEyeIcon from "../atoms/icons/ClosedEyeIcon.vue";
import WarningIcon from "../atoms/icons/WarningIcon.vue";

export default {
  name: "FormField",
  components: {
    Label,
    InputField,
    EyeIcon,
    ClosedEyeIcon,
    WarningIcon,
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
    placeholder: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      required: true,
    },
    isPassword: {
      type: Boolean,
      default: false,
    },
    hasIcon: {
      type: Boolean,
      default: false,
    },
    isEmailValid: {
      type: Boolean,
      default: true,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: null,
      required: true,
    },
    showErrorMessage: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    mask: {
      type: null,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  data: () => ({
    passwordType: "password",
    inputFocused: false,
  }),
  computed: {
    inputClass() {
      return [
        "bg-white text-lg w-full border-b border-gray-200 py-4",
        {
          "border-b-2 border-blue-600": this.inputFocused,
          "border-red-500": this.isRequired,
        },
      ];
    },
    iconColor() {
      return this.isRequired ? "#e3403b" : "#000";
    },
  },
  methods: {
    handleShowPassword() {
      if (!this.isPassword) return;

      this.passwordType =
        this.passwordType === "password" ? "text" : "password";
    },
    emitValue(newValue) {
      this.$emit("update:modelValue", newValue);
    },
    handleFocus(status) {
      this.inputFocused = status;
    },
  },
};
</script>
