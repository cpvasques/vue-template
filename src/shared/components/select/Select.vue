<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from 'reka-ui'
import { SelectRoot, useForwardPropsEmits } from 'reka-ui'
import { provide, ref } from 'vue'

const props = defineProps<
  SelectRootProps & {
    placeholder?: string
    value?: string
    hasIcon?: boolean
    disabled?: boolean
  }
>()

const emits = defineEmits<SelectRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

const isOpen = ref<boolean>(false)
provide('isOpen', isOpen)
provide('selectValue', forwarded)
</script>

<template>
  <SelectRoot v-bind="forwarded" v-model:open="isOpen" :disabled="disabled">
    <slot
      :placeholder="props.placeholder"
      :value="props.value"
      :has-icon="props.hasIcon"
    />
  </SelectRoot>
</template>
