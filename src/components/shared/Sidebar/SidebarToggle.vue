<script setup lang="ts">
defineProps<{ isExpanded: boolean }>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    class="absolute top-3 -right-3 mt-2 cursor-pointer rounded-full border border-blue-500 bg-blue-500 p-1 transition-transform duration-300"
    :class="{ 'rotate-180': isExpanded }"
    @click="emit('click')"
  >
    <slot></slot>
  </button>
</template>
