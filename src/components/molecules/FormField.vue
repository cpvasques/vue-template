<template>
  <div class="relative mb-4 w-full">
    <Label
      :id="id"
      :for="id"
      :class="['transition-all duration-300', { 'text-red-500': isRequired }]"
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
      class="absolute right-2.5 top-9 cursor-pointer"
      @click="handleShowPassword"
    >
      <EyeIcon v-if="passwordType === 'text'" :color="iconColor" />
      <ClosedEyeIcon v-else :color="iconColor" />
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
import { ref, computed } from "vue";
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
  setup(props, { emit }) {
    // DATA
    const passwordType = ref("password");
    const inputFocused = ref(false);

    // COMPUTED
    const labelClass = computed(() => [
      "absolute left-2 top-0.5 transition-all duration-300",
      {
        "text-gray-400 text-sm -translate-y-6":
          inputFocused.value || props.modelValue,
      },
      { "text-lg": !inputFocused.value && !props.modelValue },
      { "text-red-500": props.isRequired },
    ]);

    const iconColor = computed(() =>
      props.isRequired ? "#e3403b" : "#A9A9A9",
    );

    // METHODS
    const handleShowPassword = () => {
      if (!props.isPassword) return;
      passwordType.value =
        passwordType.value === "password" ? "text" : "password";
    };

    const emitValue = (newValue) => {
      emit("update:modelValue", newValue);
    };

    const handleFocus = (status) => {
      inputFocused.value = status;
    };

    return {
      passwordType,
      inputFocused,
      labelClass,
      iconColor,
      handleShowPassword,
      emitValue,
      handleFocus,
    };
  },
};
</script>
