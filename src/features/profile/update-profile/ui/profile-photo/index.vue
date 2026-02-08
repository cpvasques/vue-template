<script setup lang="ts">
import { Avatar, AvatarImage } from '@/shared/components/avatar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/dialog'
import { Button } from '@/shared/components/button'
import { X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import { useChangePhoto } from '@/features/profile/update-profile/model/useHandlePhoto'

const isDialogOpen = ref(false)
const imageData = ref({
  previewUrl: null as string | null,
  selectedFile: null as File | null,
})
const profileImageUrl = ref('https://placehold.co/216x216')
const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const { postNewPhoto } = useChangePhoto()
const { mutate: postNewPhotoMutate, isPending: isLoadingNewPhoto } =
  postNewPhoto()

const handleOpenDialog = () => {
  isDialogOpen.value = true
  imageData.value = { previewUrl: null, selectedFile: null }
}

const handleCloseDialog = () => {
  isDialogOpen.value = false
  imageData.value = { previewUrl: null, selectedFile: null }
}

const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    imageData.value.selectedFile = file
    imageData.value.previewUrl = URL.createObjectURL(file)
  }
}

const handleRemovePhoto = () => {
  if (!imageData.value.selectedFile) return
  imageData.value.selectedFile = null
  imageData.value.previewUrl = null
  toast.success('Foto removida')
}

const handleUploadPhoto = async () => {
  if (!imageData.value.selectedFile) return

  isUploading.value = true
  const payload = {
    file: imageData.value.selectedFile as File,
  }

  postNewPhotoMutate(payload)
}

defineExpose({
  isDialogOpen,
  handleOpenDialog,
  handleCloseDialog,
})
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogContent class="border-border bg-background flex-col" hide-close>
      <DialogHeader class="sm:mb-2">
        <DialogTitle
          class="text-foreground flex items-center justify-between text-2xl font-semibold"
        >
          Trocar foto
          <DialogClose class="text-muted-foreground">
            <X class="h-5 w-5" :stroke-width="1" />
          </DialogClose>
        </DialogTitle>
        <DialogDescription class="text-muted-foreground text-left text-sm">
          Escolha uma nova foto para o seu perfil
        </DialogDescription>
      </DialogHeader>

      <div class="flex justify-center">
        <Avatar
          class="bg-muted inline-flex h-[216px] w-[216px] cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle select-none"
          @click="triggerFileSelect"
        >
          <AvatarImage
            class="h-full w-full rounded-[inherit] object-cover"
            :src="imageData.previewUrl || profileImageUrl"
            alt="Profile image"
          />
        </Avatar>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          @change="handleFileChange"
          class="hidden"
        />
      </div>

      <DialogFooter class="mt-6">
        <Button type="button" variant="outline" @click="handleCloseDialog">
          Cancelar
        </Button>
        <Button
          type="button"
          variant="secondary"
          class="border-border"
          @click="handleRemovePhoto"
          :disabled="!imageData.selectedFile"
        >
          Apagar foto
        </Button>
        <Button
          type="button"
          :disabled="isUploading"
          @click="handleUploadPhoto"
        >
          {{ isLoadingNewPhoto ? 'Carregando...' : 'Trocar foto' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
