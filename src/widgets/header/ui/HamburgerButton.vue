<script setup lang="ts">
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
  <button class="mr-4" @click="toggleMenu">
    <span
      class="bg-primary mb-1 block h-0.5 w-6 transition-all duration-300"
      :class="{ 'translate-y-2 rotate-45': isOpen }"
    ></span>

    <span
      class="bg-primary mb-1 block h-0.5 w-4 transition-all duration-300"
      :class="{ 'opacity-0': isOpen }"
    ></span>

    <span
      class="bg-primary block h-0.5 w-5 transition-all duration-300"
      :class="{ 'w-6! -translate-y-1 -rotate-45': isOpen }"
    ></span>
  </button>
</template>
