<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/form'
import { Input } from '@/shared/components/input'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

import { useHandleUsers } from '@/features/users/handle-users/model/useHandleUsers'
import type { Payload as UpdateUserPayload } from '@/shared/api/users-api/types/updateUser.types'

import { updateProfileSchema } from './model/updateProfileSchema'

const { updateUser } = useHandleUsers()
const { mutate: updateUserMutate } = updateUser()

const { handleSubmit, validate } = useForm<UpdateUserPayload>({
  validationSchema: updateProfileSchema,
  validateOnMount: false,
})

interface formField {
  value: string
  label: string
  name: string
  grow: string
  mask: string
  placeholder: string
}

interface formGroup {
  [key: string]: formField
}

interface form {
  personal_info: formGroup
  address_info: formGroup
}

const form = ref<form>({
  personal_info: {
    name: {
      value: '',
      label: 'Nome',
      name: 'name',
      grow: 'col-span-12 sm:col-span-6',
      mask: '',
      placeholder: 'Digite o nome',
    },
    surname: {
      value: '',
      label: 'Sobrenome',
      name: 'surname',
      grow: 'col-span-12 sm:col-span-6',
      mask: '',
      placeholder: 'Digite o sobrenome',
    },
    email: {
      value: '',
      label: 'E-mail',
      name: 'email',
      grow: 'col-span-12 sm:col-span-6',
      mask: '',
      placeholder: 'Digite o e-mail',
    },
    phone: {
      value: '',
      label: 'Telefone',
      name: 'telephone',
      grow: 'col-span-12 sm:col-span-6',
      mask: '(##) #####-###',
      placeholder: 'Digite o telefone',
    },
  },
  address_info: {
    zipCode: {
      value: '',
      label: 'CEP',
      name: 'cep',
      grow: 'col-span-12 sm:col-span-2',
      mask: '#####-###',
      placeholder: 'CEP',
    },
    street: {
      value: '',
      label: 'Rua',
      name: 'street',
      grow: 'col-span-12 sm:col-span-8',
      mask: '',
      placeholder: 'Digite a rua',
    },
    number: {
      value: '',
      label: 'Número',
      name: 'number',
      grow: 'col-span-12 sm:col-span-2',
      mask: '',
      placeholder: 'Nº',
    },
    neighborhood: {
      value: '',
      label: 'Bairro',
      name: 'neighborhood',
      grow: 'col-span-12 sm:col-span-4',
      mask: '',
      placeholder: 'Digite o bairro',
    },
    city: {
      value: '',
      label: 'Cidade',
      name: 'city',
      grow: 'col-span-12 sm:col-span-4',
      mask: '',
      placeholder: 'Digite a cidade',
    },
    state: {
      value: '',
      label: 'Estado',
      name: 'state',
      grow: 'col-span-12 sm:col-span-4',
      mask: '',
      placeholder: 'UF',
    },
  },
})

const onSubmit = async (values: UpdateUserPayload) => {
  const { valid } = await validate()
  if (!valid) return toast.error('Preencha os campos corretamente')

  const userPayload: UpdateUserPayload = {
    name: values.name || '',
    email: values.email || '',
    phone: values.phone || '',
    street: values.street || '',
    number: values.number || '',
    neighborhood: values.neighborhood || '',
    zipCode: values.zipCode || '',
    city: values.city || '',
    state: values.state || '',
  }

  updateUserMutate(userPayload)
}

const submitForm = handleSubmit(onSubmit)

defineExpose({
  submitForm,
})
</script>

<template>
  <form @submit.prevent="submitForm" class="flex min-w-0 flex-1 flex-col gap-6">
    <Card class="border-border/50 bg-card overflow-hidden border shadow-sm">
      <CardHeader class="pb-4">
        <CardTitle class="text-foreground text-lg font-semibold">
          Informações pessoais
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="grid w-full grid-cols-12 gap-4">
          <FormField
            v-for="personal_info in form.personal_info"
            :key="personal_info.name"
            v-slot="{ componentField, errors }"
            :name="personal_info.name"
          >
            <FormItem class="w-full" :class="personal_info.grow">
              <FormLabel class="text-foreground text-sm font-medium">
                {{ personal_info.label }}
              </FormLabel>
              <FormControl>
                <Input
                  v-model="personal_info.value"
                  v-maska="personal_info.mask"
                  v-bind="componentField"
                  :has-error="!!errors.length"
                  :placeholder="personal_info.placeholder"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
    </Card>
    <Card class="border-border/50 bg-card overflow-hidden border shadow-sm">
      <CardHeader class="pb-4">
        <CardTitle class="text-foreground text-lg font-semibold">
          Endereço
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="grid w-full grid-cols-12 gap-4">
          <FormField
            v-for="address_info in form.address_info"
            v-slot="{ componentField, errors }"
            :key="address_info.name"
            :name="address_info.name"
          >
            <FormItem class="w-full" :class="address_info.grow">
              <FormLabel class="text-foreground text-sm font-medium">
                {{ address_info.label }}
              </FormLabel>
              <FormControl>
                <Input
                  v-maska="address_info.mask"
                  v-bind="componentField"
                  :has-error="!!errors.length"
                  :placeholder="address_info.placeholder"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
    </Card>
  </form>
</template>
