<script setup lang="ts">
import { Camera } from 'lucide-vue-next'

const props = defineProps<{
  name: string
  email: string
  avatar: string
}>()

const emit = defineEmits<{
  (event: 'change-photo'): void
}>()

const handleChangePhoto = () => {
  emit('change-photo')
}
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-wrap items-center gap-4">
    <div class="group relative shrink-0">
      <div
        class="ring-border/20 ring-offset-background size-12 overflow-hidden rounded-full ring-2 ring-offset-2 sm:size-14"
      >
        <img
          :src="props.avatar"
          :alt="props.name"
          class="size-full object-cover"
        />
      </div>
      <button
        type="button"
        @click="handleChangePhoto"
        class="border-background bg-primary text-primary-foreground hover:bg-primary/90 absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full border-2 shadow transition-all hover:scale-105 sm:size-7"
        aria-label="Alterar foto"
      >
        <Camera class="size-3 sm:size-3.5" />
      </button>
    </div>

    <div class="min-w-0 flex-1">
      <h1 class="text-foreground truncate font-semibold text-lg sm:text-xl">
        {{ props.name }}
      </h1>
      <p class="text-muted-foreground truncate text-sm">{{ props.email }}</p>
    </div>
  </div>
</template>
