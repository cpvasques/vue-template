<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

import { cn } from '@/lib/utils'

import { Button } from '../button/index'

interface FileInputProps {
  label?: string
  placeholder?: string
  buttonText?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  showClearIcon?: boolean
  clearIconClassName?: string
  hasError?: boolean
  containerClassName?: string
  labelClassName?: string
  inputClassName?: string
  buttonClassName?: string
  className?: string
  modelValue?: File[]
  onChange?: (files: FileList | null) => void
  onFileSelect?: (files: File[]) => void
  onClear?: () => void
}

interface FileInputEmits {
  (e: 'update:modelValue', files: File[]): void
  (e: 'change', files: FileList | null): void
  (e: 'fileSelect', files: File[]): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<FileInputProps>(), {
  label: 'Nome de usuário',
  placeholder: 'Escolher arquivo',
  buttonText: 'Selecione o arquivo',
  multiple: false,
  disabled: false,
  size: 'md',
  showClearIcon: true,
  className: '',
  clearIconClassName: '',
  hasError: false,
  containerClassName: '',
  labelClassName: '',
  inputClassName: '',
  buttonClassName: '',
  modelValue: () => [],
})

const emit = defineEmits<FileInputEmits>()

// Estado interno para controlar os arquivos selecionados (igual ao React)
const selectedFiles = ref<File[]>([])
const fileInputRef = ref<HTMLInputElement>()

const sizeConfig = {
  sm: {
    buttonSize: 'sm' as const,
    container: 'py-1.5 px-2.5 text-xs',
    label: 'text-xs',
    icon: 'h-3 w-3',
  },
  md: {
    buttonSize: 'default' as const,
    container: 'py-2 px-3 text-sm',
    label: 'text-sm',
    icon: 'h-4 w-4',
  },
}

const currentSize = computed(() => sizeConfig[props.size])

// Função getDisplayText igual ao React
const getDisplayText = () => {
  if (selectedFiles.value.length === 0) return props.placeholder
  if (selectedFiles.value.length === 1) return selectedFiles.value[0].name
  return `${selectedFiles.value.length} arquivos selecionados`
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    const fileArray = Array.from(files)
    selectedFiles.value = fileArray
    emit('update:modelValue', fileArray)
    emit('change', files)
    emit('fileSelect', fileArray)
    props.onChange?.(files)
    props.onFileSelect?.(fileArray)
  }
}

const handleButtonClick = () => {
  fileInputRef.value?.click()
}

const handleClear = () => {
  selectedFiles.value = []
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  emit('update:modelValue', [])
  emit('change', null)
  emit('clear')
  props.onChange?.(null)
  props.onClear?.()
}

// Sincronizar com v-model externo se fornecido
const syncWithModelValue = () => {
  if (props.modelValue && props.modelValue.length > 0) {
    selectedFiles.value = [...props.modelValue]
  }
}

// Watch para sincronizar com v-model externo
watch(() => props.modelValue, syncWithModelValue, { immediate: true })

// Expose methods for parent component access if needed
defineExpose({
  clear: handleClear,
  getSelectedFiles: () => selectedFiles.value,
})
</script>

<template>
  <div class="max-w-96 space-y-2" :class="containerClassName">
    <label
      v-if="label"
      :class="[
        'block font-semibold text-foreground',
        currentSize.label,
        hasError && 'text-destructive',
        labelClassName,
      ]"
    >
      {{ label }}
    </label>

    <div class="relative flex items-center" :class="inputClassName">
      <input
        ref="fileInputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        @change="handleFileChange"
        class="hidden"
      />

      <div
        :class="
          cn(
            'relative flex flex-1 items-center justify-between rounded-md border border-input bg-background transition-colors focus-within:ring-2 focus-within:ring-ring/20',
            hasError &&
              'border border-destructive focus-within:ring-2 focus-within:ring-destructive/20',
            currentSize.container,
            className,
          )
        "
      >
        <span class="pr-8">{{ getDisplayText() }}</span>

        <Button
          v-if="showClearIcon && selectedFiles.length > 0"
          variant="ghost"
          type="button"
          @click="handleClear"
          :disabled="disabled"
          :size="currentSize.buttonSize"
          :class="[
            'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
            size !== 'sm' && 'h-9',
            clearIconClassName,
          ]"
          title="Limpar arquivos selecionados"
        >
          <X :class="currentSize.icon" />
        </Button>

        <Button
          v-if="selectedFiles.length === 0"
          type="button"
          @click="handleButtonClick"
          :size="currentSize.buttonSize"
          :class="[
            'border-none bg-muted text-muted-foreground shadow-none hover:bg-muted/80',
            size === 'sm' && 'text-xs',
            buttonClassName,
          ]"
        >
          {{ buttonText }}
        </Button>
      </div>
    </div>
  </div>
</template>
