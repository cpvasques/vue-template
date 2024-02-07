<template>
  <input
    :id="id"
    :type="type"
    :placeholder="placeholder"
    :value="value"
    class="duration-400 w-full rounded border-b border-gray-200 bg-white p-2 text-lg outline-none transition-all focus:border-b-2 focus:border-blue-600"
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
