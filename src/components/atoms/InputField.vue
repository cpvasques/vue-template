<template>
  <input
    :id="id"
    :type="type"
    :placeholder="placeholder"
    :value="value"
    class="bg-white text-lg w-full border-b border-gray-200 p-2 focus:border-b-2 focus:border-blue-600 transition-all duration-400 rounded outline-none"
    :class="{ 'border-red-600 focus:border-red-600': isRequired }"
    @input="$emit('update:value', $event.target.value)"
  />
</template>

<script>
export default {
  name: "InputField",
  props: {
    id: { type: String, required: true },
    type: { type: String, required: true },
    placeholder: { type: String, required: true },
    value: { type: [String, Number], required: true },
    isRequired: { type: Boolean, default: false },
  },
  emits: ["update:value"],
};
</script>
