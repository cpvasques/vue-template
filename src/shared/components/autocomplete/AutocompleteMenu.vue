<script setup lang="ts">
import type { Option } from '.'

const props = defineProps<{
  options?: Option[]
  selectedOption?: Option
  noDataText?: string
  isLoading?: boolean
}>()

const emits = defineEmits<{
  (e: 'handleSelectItem', payload: Option): void
}>()

const hasData = computed(() => props.options?.length)
const errorMessage = computed(
  () => props.noDataText || 'Sem dados disponíveis.',
)
const infoMessage = computed(() =>
  props.isLoading ? 'Buscando informações' : errorMessage.value,
)

const handleSelectItem = (payload: Option) => {
  emits('handleSelectItem', payload)
}
</script>

<template>
  <ul
    class="pointer-events-auto! z-50! max-h-80 w-fit overflow-auto border! border-border! bg-background py-2 shadow-md"
  >
    <template v-if="hasData">
      <li
        v-for="(item, index) in props.options"
        :key="(item.value as string) || index"
        class="cursor-pointer px-4 py-2 text-sm font-medium text-accent-foreground duration-200 ease-in hover:bg-accent"
        :class="{
          'bg-accent text-accent-foreground':
            selectedOption?.value == item.value,
        }"
        @click="handleSelectItem(item)"
      >
        <slot name="item" v-bind="item"></slot>
        <slot name="default" v-bind="item"></slot>
      </li>
    </template>

    <li v-else class="px-4 py-2 text-sm font-medium text-primary">
      {{ infoMessage }}
    </li>
  </ul>
</template>
