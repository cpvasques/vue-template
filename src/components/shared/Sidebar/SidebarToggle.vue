<script setup lang="ts">
defineProps<{ isExpanded: boolean }>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    class="absolute cursor-pointer -right-3 top-3 mt-2 transition-transform duration-300 border border-blue-500 rounded-full p-1 bg-blue-500"
    :class="{ 'rotate-180': isExpanded }"
    @click="emit('click')"
  >
    <slot></slot>
  </button>
</template>
