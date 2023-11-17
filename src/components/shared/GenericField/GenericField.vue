<template>
  <div class="generic-field" :class="[{ required: isRequired }]">
    <label
      class="generic-field__label"
      :class="[
        { 'has-value': modelValue },
        { focus: modelValue && inputFocused },
      ]"
      :for="id"
    >
      {{ placeholder }}
    </label>
    <div :class="[{ 'generic-field__icon': isPassword }]">
      <!-- input has mask -->
      <input
        v-if="mask"
        :id="id"
        v-mask="mask"
        class="generic-field__input"
        :type="!isPassword ? type : passwordType"
        :placeholder="placeholder"
        :value="modelValue"
        autocomplete="new-password"
        @input="emitValue($event.target.value)"
        @focus="handleFocus(true)"
        @blur="handleFocus(false)"
      />

      <!-- input without mask -->
      <input
        v-else
        :id="id"
        class="generic-field__input"
        :type="!isPassword ? type : passwordType"
        :placeholder="placeholder"
        :value="modelValue"
        autocomplete="new-password"
        @input="emitValue($event.target.value)"
        @focus="handleFocus(true)"
        @blur="handleFocus(false)"
      />

      <!-- password input -->
      <div
        v-if="isPassword"
        class="generic-field__input--icon"
        @click="handleShowPassword"
      >
        <ClosedEyeIcon
          v-if="isPassword && passwordType == 'text'"
          :color="isRequired ? '#e3403b' : '#A9A9A9'"
        />
        <EyeIcon
          v-else-if="isPassword && passwordType == 'password'"
          :color="isRequired ? '#e3403b' : '#A9A9A9'"
        />
      </div>
    </div>

    <!-- error messages -->
    <div v-if="errorMessage && showErrorMessage" class="generic-field__error">
      <WarningIcon />
      <span class="generic-field__error--text">
        {{ errorMessage }}
      </span>
    </div>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import EyeIcon from "@/components/shared/Icons/EyeIcon.vue";
import ClosedEyeIcon from "@/components/shared/Icons/ClosedEyeIcon.vue";
import WarningIcon from "@/components/shared/Icons/WarningIcon.vue";

export default {
  name: "GenericInput",
  components: {
    EyeIcon,
    ClosedEyeIcon,
    WarningIcon,
  },
  directives: {
    mask,
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

<style lang="scss" scoped>
@import "GenericField.scss";
</style>
