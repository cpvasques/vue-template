<template>
  <div class="relative w-full mb-4">
    <Label
      :id="id"
      :for="id"
      :class="[
        'absolute left-2 top-2 transition-all duration-300',
        { 'text-gray-400 text-sm -translate-y-6': inputFocused || modelValue },
        { 'text-lg': !inputFocused && !modelValue },
        { 'text-red-500': isRequired },
      ]"
    >
      {{ placeholder }}
    </Label>
    <InputField
      :id="id"
      :type="!isPassword ? type : passwordType"
      placeholder=""
      :is-required="isRequired"
      :value="modelValue"
      @update:value="emitValue"
      @focus="handleFocus(true)"
      @blur="handleFocus(false)"
    />
    <div
      v-if="isPassword"
      class="absolute top-3 right-2.5 cursor-pointer"
      @click="handleShowPassword"
    >
      <EyeIcon v-if="passwordType === 'text'" :color="iconColor" />
      <ClosedEyeIcon v-else :color="iconColor" />
    </div>
    <div v-if="errorMessage && showErrorMessage" class="flex items-center mt-1">
      <WarningIcon />
      <span class="text-red-500 text-sm font-normal leading-4 ml-1">
        {{ errorMessage }}
      </span>
    </div>
  </div>
</template>

<script>
import Label from "../atoms/Label.vue";
import InputField from "../atoms/InputField.vue";
import EyeIcon from "../atoms/SvgIcons/EyeIcon.vue";
import ClosedEyeIcon from "../atoms/SvgIcons/ClosedEyeIcon.vue";
import WarningIcon from "../atoms/SvgIcons/WarningIcon.vue";

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
      return this.isRequired ? "#e3403b" : "#A9A9A9";
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
