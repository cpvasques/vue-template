<script setup lang="ts">
import { Button } from '@/shared/components/button'
import { ChevronLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

defineProps<{
  name: string
}>()

const emit = defineEmits(['submitForm'])
const router = useRouter()

const handleClickSubmit = () => {
  emit('submitForm')
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div
    class="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="flex min-w-0 flex-1 items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        class="border-border/50 hover:bg-accent/50 size-9 shrink-0 rounded-full border"
        @click="handleBack"
      >
        <ChevronLeft class="text-foreground size-5" />
      </Button>
      <slot name="leading">
        <h1
          class="text-foreground font-inter text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {{ name }}
        </h1>
      </slot>
    </div>
    <div class="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
      <slot name="actions">
        <Button @click="handleClickSubmit" variant="default">
          Editar perfil
        </Button>
      </slot>
    </div>
  </div>
</template>
