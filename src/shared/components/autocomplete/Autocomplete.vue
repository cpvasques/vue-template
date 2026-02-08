<script setup lang="ts">
import { offset, useFloating } from '@floating-ui/vue'
import { ChevronDown, ChevronUp, LoaderCircle, X } from 'lucide-vue-next'
import type { GenericObject } from 'vee-validate'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

import type { Option } from '.'
import AutocompleteMenu from './AutocompleteMenu.vue'

const uniqueId = () => Math.random().toString(36).substring(2, 10)

const menuId = `autocomplete-menu-${uniqueId()}`
const inputId = `autocomplete-input-${uniqueId()}`

// PROPS
const props = defineProps<{
  defaultValue?: GenericObject | string
  modelValue?: GenericObject | string
  placeholder?: string
  class?: HTMLAttributes['class']
  hasError?: boolean
  inputClass?: HTMLAttributes['class']
  options?: Option[]
  noDataText?: string
  isLoading?: boolean
  isFetch?: boolean
  disabled?: boolean
  onFilter?: (search: string) => Option[]
  debounceTime?: number
  floating?: boolean // ← Nova prop para controlar comportamento da lista
}>()

// SETUP
const slots = useSlots()
const debounceTime = computed(() => props.debounceTime ?? 500)
const disableFilter = ref(false)

const debouncedSearch = useDebounceFn(() => {
  disableFilter.value = false
}, debounceTime.value)

const emits = defineEmits<{
  (e: 'update:modelValue', payload: GenericObject): void
  (e: 'change', payload: Option): void
  (e: 'handleNextPage'): void
}>()

const [isOpen, toggleMenu] = useToggle(false)
const modelValue = useVModel(props, 'modelValue', emits, {
  defaultValue: props.defaultValue,
})

const selectedOption = computed(() => {
  const current = modelValue.value
  const currentValue =
    current && typeof current === 'object' && 'value' in current
      ? (current as any).value
      : current
  return props.options?.find(({ value }) => value === currentValue)
})

const option = ref<string>(selectedOption.value?.label || '')

// FLOATING UI & DIMENSIONS
const autocompleteContainer = ref<HTMLElement | null>(null)
const setAutocompleteContainer = (el: HTMLElement | null) => {
  autocompleteContainer.value = el
}

const autocompleteMenu = ref<HTMLElement | null>(null)
const setAutocompleteMenu = (el: HTMLElement | null) => {
  autocompleteMenu.value = el
}

const inputOption = ref<HTMLElement | null>(null)
const setInputOption = (el: HTMLElement | null) => {
  inputOption.value = el
}

const AutocompleteMenuStyles = ref<GenericObject>({})

const { floatingStyles } = useFloating(
  autocompleteContainer,
  autocompleteMenu,
  {
    placement: 'bottom-start',
    strategy: props.floating ? 'fixed' : 'absolute',
    middleware: [offset(10)],
  },
)

const { width: widthAutocompleteContainer } = useElementSize(
  autocompleteContainer,
)

// UTIL: Verifica se qualquer valor em obj contém a string de busca
const objectContainsString = (obj: unknown, searchString: string): boolean => {
  if (typeof obj === 'string')
    return obj.toLowerCase().includes(searchString.toLowerCase())

  if (Array.isArray(obj))
    return obj.some((item) => objectContainsString(item, searchString))

  if (typeof obj === 'object' && obj !== null)
    return Object.values(obj).some((value) =>
      objectContainsString(value, searchString),
    )

  return false
}

const hasSelectedItemSlot = computed(() => !!slots.selectedItem)

const hasValue = computed(() => {
  if (!modelValue.value) return false

  if (typeof modelValue.value === 'string') {
    return modelValue.value.trim() !== ''
  }

  if (typeof modelValue.value === 'object') {
    return (
      modelValue.value.value !== '' &&
      modelValue.value.value !== null &&
      modelValue.value.value !== undefined
    )
  }

  return false
})

// OPTIONS MENU: Filtra as opções baseado no que foi digitado
const optionsMenu = computed(() => {
  if (disableFilter.value || !option.value) return props.options
  if (props.onFilter) return props.onFilter(option.value)

  return props.options?.filter((opt) => objectContainsString(opt, option.value))
})

const hasOptions = computed(() => props.options?.length)
const hasCallbackNextPage = computed(
  () => props.isLoading !== undefined && !props.isLoading,
)

// HANDLERS
const handleSelectItem = (payload: Option) => {
  option.value = !hasSelectedItemSlot.value ? payload.label : ''
  disableFilter.value = true
  modelValue.value = payload
  emits('change', payload)
  toggleMenu(false)
}

const onKeyup = (event: KeyboardEvent) => {
  if (['Backspace', 'Delete'].includes(event.key) && props.isFetch) {
    modelValue.value = { label: '', value: '' }
  }
  debouncedSearch()
}

const onClickInput = () => {
  if (props.disabled) return
  const wasOpen = isOpen.value
  toggleMenu()
  if (!wasOpen) {
    inputOption.value?.focus()
  }
}

const extractOptionValue = (
  val: GenericObject | string | undefined,
): string => {
  if (!val) return ''
  if (typeof val === 'string') return val

  return typeof val.label === 'string'
    ? val.label
    : typeof val.value === 'string'
      ? val.value
      : ''
}

// CLICK OUTSIDE & INFINITE SCROLL
onClickOutside(autocompleteMenu, () => toggleMenu(false), {
  ignore: [autocompleteContainer],
})
useInfiniteScroll(
  autocompleteMenu,
  () => {
    if (hasOptions.value && hasCallbackNextPage.value) emits('handleNextPage')
  },
  { distance: 10 },
)

// WATCHERS
watch(
  floatingStyles,
  () => {
    AutocompleteMenuStyles.value = {
      ...floatingStyles.value,
      minWidth: `${widthAutocompleteContainer.value}px`,
    }
  },
  { deep: true },
)

watch(
  modelValue,
  (newValue) => {
    option.value = extractOptionValue(newValue)
  },
  { deep: true, immediate: true },
)

watch(
  () => props.disabled,
  (isDisabled) => {
    if (isDisabled && isOpen.value) {
      toggleMenu(false)
    }
  },
)

const clear = () => {
  modelValue.value = { label: '', value: '' }
  option.value = ''
  disableFilter.value = false
  toggleMenu(false)
}

const getSelectedItemProps = computed(() => {
  return typeof props.modelValue === 'string'
    ? { value: props.modelValue }
    : props.modelValue
})

defineExpose({ clear })
</script>

<template>
  <div
    :ref="setAutocompleteContainer"
    class="relative flex flex-col"
    :class="{ 'cursor-not-allowed opacity-70': props.disabled }"
  >
    <div
      :class="
        cn(
          'flex min-h-10 w-full gap-4 rounded-lg border border-input px-3 py-2 pr-8',
          props.class,
          props.hasError && 'border-red-700',
          isOpen && 'border-blue',
        )
      "
    >
      <slot
        v-if="slots.selectedItem"
        name="selectedItem"
        v-bind="getSelectedItemProps"
      ></slot>
      <input
        :id="inputId"
        :ref="setInputOption"
        v-model="option"
        class="peer h-full w-auto flex-1 bg-background text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:opacity-50"
        :class="
          cn(
            hasSelectedItemSlot && 'w-[100px]!',
            disabled && 'cursor-not-allowed',
            inputClass,
          )
        "
        :placeholder="placeholder"
        :disabled="disabled || isLoading"
        autocomplete="off"
        @click.stop="onClickInput"
        @keyup="onKeyup"
      />
    </div>

    <span
      class="absolute right-1 top-3 flex items-center justify-center px-2 transition-all"
    >
      <LoaderCircle v-if="isLoading" class="animate-spin" />
      <X
        v-else-if="hasValue && !props.disabled"
        class="size-4 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
        @click.stop="clear"
      />
      <ChevronUp
        v-else-if="isOpen && !props.disabled"
        class="size-4 cursor-pointer text-muted-foreground transition-all"
        @click.stop="toggleMenu()"
      />
      <ChevronDown
        v-else
        :class="
          cn(
            'size-4 cursor-pointer text-muted-foreground transition-all',
            props.disabled && 'cursor-not-allowed',
          )
        "
        @click.stop="!props.disabled && toggleMenu()"
      />
    </span>

    <Teleport v-if="props.floating" to="body">
      <AutocompleteMenu
        :id="menuId"
        v-if="isOpen"
        :ref="setAutocompleteMenu"
        :style="AutocompleteMenuStyles"
        :options="optionsMenu"
        :no-data-text="noDataText"
        :selected-option="selectedOption"
        :is-loading="isLoading"
        @handle-select-item="handleSelectItem"
      >
        <template #item="item">
          <slot v-if="slots.item" name="item" v-bind="item"></slot>
          <template v-else>
            <p>{{ item.label }}</p>
          </template>
        </template>
      </AutocompleteMenu>
    </Teleport>

    <AutocompleteMenu
      v-else-if="isOpen"
      :id="menuId"
      :ref="setAutocompleteMenu"
      :style="AutocompleteMenuStyles"
      :options="optionsMenu"
      :no-data-text="noDataText"
      :selected-option="selectedOption"
      :is-loading="isLoading"
      @handle-select-item="handleSelectItem"
    >
      <template #item="item">
        <slot v-if="slots.item" name="item" v-bind="item"></slot>
        <template v-else>
          <p>{{ item.label }}</p>
        </template>
      </template>
    </AutocompleteMenu>
  </div>
</template>
