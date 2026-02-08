<script setup lang="ts">
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

import { useDeleteUsers } from '@/features/users/delete-users/model/useDeleteUsers'
import type { User } from '@/shared/api/users-api/types/getAllUsers.types'

const { deleteUser } = useDeleteUsers()
const { mutate: deleteUserMutate, isPending: isLoadingDeleteUser } =
  deleteUser()

const isDialogOpen = ref(false)
const currentUser = ref<User | null>(null)

const handleOpenDialog = (userData: User) => {
  isDialogOpen.value = true
  currentUser.value = userData
}

const handleCloseDialog = () => {
  isDialogOpen.value = false
  currentUser.value = null
}

const handleConfirmDelete = () => {
  if (!currentUser.value || !currentUser.value.id) return

  deleteUserMutate(currentUser.value.id, {
    onSuccess(res) {
      if (!res) return

      toast.success('Usuário excluído com sucesso!')
      handleCloseDialog()
    },
  })
}

defineExpose({
  isDialogOpen,
  handleOpenDialog,
  handleCloseDialog,
})
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogContent
      class="bg-white sm:max-h-52! sm:max-w-72! dark:bg-zinc-900"
      hide-close
    >
      <DialogHeader>
        <DialogTitle
          class="text-foreground flex items-center justify-between text-2xl font-semibold"
        >
          Excluir usuário
          <DialogClose class="text-muted-foreground">
            <X class="h-5 w-5" :stroke-width="1" />
          </DialogClose>
        </DialogTitle>
        <DialogDescription
          v-if="currentUser"
          class="text-muted-foreground mt-7 max-w-48 text-left text-sm"
        >
          Tem certeza que deseja excluir o usuário
          <span class="text-foreground font-semibold">
            {{ currentUser.name }}?
          </span>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          :disabled="isLoadingDeleteUser"
          @click="handleCloseDialog"
        >
          Cancelar
        </Button>
        <Button
          class="border-border text-destructive-foreground mb-2 sm:mt-0"
          type="button"
          variant="destructive"
          :disabled="isLoadingDeleteUser"
          @click="handleConfirmDelete"
        >
          Excluir
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
