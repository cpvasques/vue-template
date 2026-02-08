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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/form'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/select'
import { X } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

import { postNewUserSchema } from '@/features/users/handle-users/model/postNewUserSchema'
import { useHandleUsers } from '@/features/users/handle-users/model/useHandleUsers'
import type { User } from '@/shared/api/users-api/types/getAllUsers.types'
import type { Payload as PostNewUserPayload } from '@/shared/api/users-api/types/postNewUser.types'

const { postNewUser, updateUser } = useHandleUsers()
const { mutate: postNewUserMutate, isPending: isLoadingPostNewUser } =
  postNewUser()
const { mutate: updateUserMutate, isPending: isLoadingUpdateUser } =
  updateUser()

const statusList = [
  { id: 'active', label: 'Ativo' },
  { id: 'inactive', label: 'Inativo' },
  { id: 'blocked', label: 'Bloqueado' },
]

const isDialogOpen = ref(false)
const isEditMode = ref(false)
const currentUser = ref<User | null>(null)

const { handleSubmit, validate, resetForm, setFieldValue } = useForm({
  validationSchema: postNewUserSchema,
  validateOnMount: false,
})

const handleOpenDialog = (userData?: User) => {
  isDialogOpen.value = true

  if (userData) {
    isEditMode.value = true
    currentUser.value = userData

    setFieldValue('name', userData.name || '')
    setFieldValue('email', userData.email || '')
    setFieldValue('phone', userData.phone || '')
    setFieldValue(
      'status',
      typeof userData.status === 'string' ? userData.status : '',
    )
  } else {
    isEditMode.value = false
    currentUser.value = null
  }
}

const handleCloseDialog = () => {
  isDialogOpen.value = false
  isEditMode.value = false
  currentUser.value = null
  resetForm()
}

const onSubmit = async (values: PostNewUserPayload) => {
  const { valid } = await validate()
  if (!valid) return toast.error('Preencha os campos corretamente')

  const userPayload: PostNewUserPayload = {
    name: values.name || '',
    email: values.email || '',
    phone: values.phone || '',
    status: values.status || '',
  }

  if (isEditMode.value && currentUser.value) {
    return updateUserMutate(userPayload, {
      onSuccess(res) {
        if (!res) return
        handleCloseDialog()
      },
    })
  }

  postNewUserMutate(userPayload, {
    onSuccess(res) {
      if (!res) return
      handleCloseDialog()
    },
  })
}

const submitForm = handleSubmit(onSubmit)

defineExpose({
  isDialogOpen,
  handleOpenDialog,
  handleCloseDialog,
})
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogContent class="border-border bg-background" hide-close>
      <DialogHeader class="sm:mb-2">
        <DialogTitle
          class="text-foreground flex items-center justify-between text-2xl font-semibold"
        >
          {{ isEditMode ? 'Editar usuário' : 'Novo usuário' }}
          <DialogClose class="text-muted-foreground">
            <X class="h-5 w-5" :stroke-width="1" />
          </DialogClose>
        </DialogTitle>
        <DialogDescription class="text-muted-foreground text-left text-sm">
          {{
            isEditMode
              ? 'Atualize as informações do usuário e salve as alterações.'
              : 'Preencha as informações abaixo para criar um novo usuário'
          }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="submitForm" class="grid grid-cols-12 gap-4">
        <FormField v-slot="{ componentField, errors }" name="name">
          <FormItem class="col-span-12">
            <FormLabel class="text-foreground text-sm font-medium">
              Nome do usuário
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Digite o nome do usuário"
                v-bind="componentField"
                :has-error="!!errors.length"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, errors }" name="email">
          <FormItem class="col-span-12">
            <FormLabel class="text-foreground text-sm font-medium">
              Email
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Digite o email do usuário"
                v-bind="componentField"
                :has-error="!!errors.length"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, errors }" name="telephone">
          <FormItem class="col-span-12 sm:col-span-6">
            <FormLabel class="text-foreground text-sm font-medium">
              Telefone
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Digite o telefone do usuário"
                v-bind="componentField"
                :has-error="!!errors.length"
                phone
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField, errors }" name="status">
          <FormItem class="col-span-12 sm:col-span-6">
            <FormLabel class="text-foreground text-sm font-medium">
              Status
            </FormLabel>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger :has-error="!!errors.length">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="state in statusList"
                      :key="state.id"
                      :value="state.id"
                    >
                      {{ state.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter class="col-span-12 mt-2">
          <Button
            type="button"
            variant="outline"
            :disabled="isLoadingPostNewUser || isLoadingUpdateUser"
            @click="handleCloseDialog"
          >
            Cancelar
          </Button>
          <Button
            class="mb-2 sm:mt-0"
            type="submit"
            :disabled="isLoadingPostNewUser || isLoadingUpdateUser"
          >
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
