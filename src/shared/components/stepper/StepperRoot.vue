<script setup lang="ts">
import { StepperRoot } from 'reka-ui'
</script>

<template>
  <StepperRoot v-bind="$attrs">
    <slot />
  </StepperRoot>
</template>
