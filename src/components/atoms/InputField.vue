<template>
  <input
    :id="id"
    :type="type"
    :placeholder="placeholder"
    :value="value"
    class="duration-400 h-10 w-full rounded border bg-white p-2 text-sm font-normal outline-none transition-all focus:border-black"
    :class="[
      isRequired ? 'border-red-600 focus:border-red-600' : 'border-gray-300',
    ]"
    autocomplete="off"
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
