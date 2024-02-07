<template>
  <label :for="id" class="text-lg font-normal leading-6">
    <slot></slot>
  </label>
</template>

<script>
export default {
  name: "Label",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
};
</script>
