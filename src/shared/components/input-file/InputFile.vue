<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { CircleX } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'
import { computed, provide, ref, watch } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: Array<File>
  modelValue?: Array<File>
  class?: HTMLAttributes['class']
  btnClass?: HTMLAttributes['class']
  hasError?: boolean
  acceptTypes?: Array<string>
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const uploadedFiles = ref([])
const uploadInput = ref()
const isDragging = ref(false)
const rejectTypes = ref(false)
const hasPreview = ref(false)
const hasEmpty = computed(() => !modelValue.value)
const label = computed(() => {
  if (rejectTypes.value) {
    return 'Tipo inválido'
  }
  if (isDragging.value) {
    return 'Solte seus arquivos'
  }
  return 'Selecione o arquivo'
})
const onLoadFile = (target: EventTarget | null) => {
  const { files } = target as HTMLInputElement

  if (!files?.length) return

  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      console.error('O arquivo não pode ser maior que 5mb.')
      return
    }
    if (!props.acceptTypes || !props.acceptTypes.includes(file.type)) {
      return (rejectTypes.value = true)
    }
    hasPreview.value = true
    uploadedFiles.value = [...uploadedFiles.value, file]
    modelValue.value = [...(modelValue?.value || []), file]
  }
}

const handleFile = () => uploadInput.value.click()
const inputAccept = computed(() => props.acceptTypes?.join(','))
provide('hasEmpty', hasEmpty)

const dragover = (e: DragEvent) => {
  e.preventDefault()
  rejectTypes.value = false
  isDragging.value = true
}

const dragleave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false

  if (e.dataTransfer?.files?.length) {
    for (const file of e.dataTransfer.files) {
      if (file.size > 5 * 1024 * 1024) {
        console.error('O arquivo não pode ser maior que 5mb.')
        return
      }

      if (!props.acceptTypes || !props.acceptTypes.includes(file.type)) {
        return (rejectTypes.value = true)
      }
      hasPreview.value = true
      uploadedFiles.value = [...uploadedFiles.value, file]
      modelValue.value = [...(modelValue?.value || []), file]
    }
  }
}

const generateURL = (file: File) => {
  const fileSrc = URL.createObjectURL(file)
  setTimeout(() => {
    URL.revokeObjectURL(fileSrc)
  }, 1000)
  return fileSrc
}

const isImage = (file: File) => {
  return file.type && file.type.startsWith('image/')
}

const removeImage = (id: number) => {
  uploadedFiles.value = uploadedFiles.value.filter((_, index) => index !== id)
  modelValue.value = modelValue.value.filter((_, index) => index !== id)

  if (!uploadedFiles.value.length) {
    hasPreview.value = false
  }
}

watch(
  modelValue,
  (newValue) => {
    if (!newValue) uploadInput.value.value = null
  },
  {
    deep: true,
  },
)
</script>

<template>
  <div v-if="uploadedFiles.length && hasPreview">
    <div v-for="(file, key) in uploadedFiles" :key="key" class="relative">
      <div v-if="isImage(file)">
        <img class="preview-img" :src="generateURL(file)" />
        <CircleX
          class="absolute right-0 top-0 cursor-pointer"
          @click="removeImage(key)"
        />
      </div>
    </div>
  </div>
  <div
    class="flex h-20 min-w-full items-center justify-between rounded-lg border border-dashed px-5 py-[22px]"
    :class="
      cn(
        'flex h-20 min-w-full items-center justify-between rounded-lg border border-dashed px-5 py-[22px]',
        props.class,
        props.hasError && 'border-red-700',
        rejectTypes && 'border-red-700',
      )
    "
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="handleDrop"
  >
    <slot />
    <button
      type="button"
      class="flex h-[50px] max-w-[196px]! cursor-pointer items-center justify-center rounded-md px-[30px] py-3 text-base font-semibold"
      :class="
        cn(props.hasError || (rejectTypes && 'bg-red-700!'), props.btnClass)
      "
      @click="handleFile"
    >
      {{ label }}
    </button>

    <input
      ref="uploadInput"
      type="file"
      name="uploadFile"
      multiple
      class="hidden"
      :accept="inputAccept || '.pdf'"
      @change="({ target }) => onLoadFile(target)"
    />
  </div>
</template>
