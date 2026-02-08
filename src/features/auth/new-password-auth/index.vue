<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/form'
import { Button } from '@/shared/components/button'
import { InputPassword } from '@/shared/components/input-password'
import { RectangleEllipsis } from 'lucide-vue-next'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

import { newPasswordSchema } from '@/features/auth/new-password-auth/model/newPasswordSchema'
import { useNewPassword } from '@/features/auth/new-password-auth/model/useNewPassword'
import PasswordRules from '@/features/auth/new-password-auth/ui/password-rules.vue'
import SuccessMessage from '@/features/auth/new-password-auth/ui/success-message.vue'
import type { Payload as NewPasswordPayload } from '@/shared/api/auth-api/types/postNewPassword.types'

const { postNewPassword } = useNewPassword()
const { mutate: postNewPasswordMutate, isPending: isLoadingNewPassword } =
  postNewPassword()

const showSuccess = ref<boolean>(false)

const { handleSubmit, validate } = useForm({
  validationSchema: newPasswordSchema,
  validateOnMount: false,
})

const { value: passwordValue } = useField<string>('password')

const onSubmit = async (values: NewPasswordPayload) => {
  const { valid } = await validate()
  if (!valid) return toast.error('Preencha os campos corretamente')

  const newPasswordPayload: NewPasswordPayload = {
    password: values.password || '',
    token: 'token',
  }

  postNewPasswordMutate(newPasswordPayload, {
    onSuccess(res) {
      if (!res) return
      showSuccess.value = true
    },
  })
}

const submitForm = handleSubmit(onSubmit)
</script>

<template>
  <span>
    <div v-if="!showSuccess" class="w-full sm:px-36 lg:px-60 xl:px-96">
      <RectangleEllipsis class="mb-5" />
      <h1 class="mb-1 text-left text-2xl font-semibold text-zinc-950">
        Nova senha
      </h1>
      <p class="mb-6 text-left text-sm text-zinc-500">
        Crie uma nova senha para acessar sua conta.
      </p>

      <form @submit.prevent="submitForm" class="space-y-4">
        <FormField v-slot="{ componentField, errors }" name="password">
          <FormItem>
            <FormLabel class="text-sm font-medium text-zinc-950">
              Nova senha
            </FormLabel>
            <FormControl>
              <InputPassword
                placeholder="Senha"
                v-bind="componentField"
                :has-error="!!errors.length"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField, errors }" name="confirmPassword">
          <FormItem>
            <FormLabel class="text-sm font-medium text-zinc-950">
              Confirmar nova senha
            </FormLabel>
            <FormControl>
              <InputPassword
                placeholder="Senha"
                v-bind="componentField"
                :has-error="!!errors.length"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button
          class="mt-6! w-full"
          type="submit"
          :is-loading="isLoadingNewPassword"
        >
          Redefinir senha
        </Button>

        <PasswordRules :password="passwordValue || ''" />
      </form>
    </div>
    <SuccessMessage v-else />
  </span>
</template>
