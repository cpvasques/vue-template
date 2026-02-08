<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="flex w-full flex-col items-center justify-between sm:flex-row">
    <h1
      class="font-inter text-foreground mb-5 text-3xl leading-normal font-bold sm:mb-0"
    >
      {{ title }}
    </h1>
    <div class="actions w-full sm:w-auto">
      <slot name="actions"></slot>
    </div>
  </div>
</template>
