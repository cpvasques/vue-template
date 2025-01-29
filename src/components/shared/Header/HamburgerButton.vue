<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (event: 'click'): void
}>()

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  emit('click')
}
</script>

<template>
  <button class="mr-4 sm:hidden" @click="toggleMenu">
    <span
      class="mb-1 block h-0.5 w-6 bg-gray-800 transition-all duration-300"
      :class="{ 'translate-y-2 rotate-45': isOpen }"
    ></span>

    <span
      class="mb-1 block h-0.5 w-6 bg-gray-800 transition-all duration-300"
      :class="{ 'opacity-0': isOpen }"
    ></span>

    <span
      class="block h-0.5 w-6 bg-gray-800 transition-all duration-300"
      :class="{ '-translate-y-1 -rotate-45': isOpen }"
    ></span>
  </button>
</template>
