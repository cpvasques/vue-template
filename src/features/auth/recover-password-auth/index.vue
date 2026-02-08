<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/form'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { KeyRound } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { recoverPasswordSchema } from '@/features/auth/recover-password-auth/model/recoverSchema'
import { useRecoverPassword } from '@/features/auth/recover-password-auth/model/useRecoverPassword'
import type { Payload as RecoverPayload } from '@/shared/api/auth-api/types/postRecover.types'

const router = useRouter()
const { postRecoverPassword } = useRecoverPassword()
const { mutate: postRecoverMutate, isPending: isLoadingRecover } =
  postRecoverPassword()

const { handleSubmit, validate } = useForm({
  validationSchema: recoverPasswordSchema,
  validateOnMount: false,
})

const onSubmit = async (values: RecoverPayload) => {
  const { valid } = await validate()
  if (!valid) return toast.error('Preencha os campos corretamente')

  const recoverPayload: RecoverPayload = {
    email: values.email || '',
  }

  postRecoverMutate(recoverPayload, {
    onSuccess(res) {
      if (!res) return
      router.push({ name: 'Login' })
    },
  })
}

const submitForm = handleSubmit(onSubmit)
</script>

<template>
  <div class="w-full sm:px-36 lg:px-60 xl:px-96">
    <KeyRound class="mb-5" />
    <h1 class="mb-1 text-left text-2xl font-semibold text-zinc-950">
      Recuperar senha
    </h1>
    <p class="mb-6 text-left text-sm text-zinc-500">
      Informe o e-mail cadastrado para receber o código de verificação.
    </p>

    <form @submit.prevent="submitForm" class="space-y-4">
      <FormField v-slot="{ componentField, errors }" name="email">
        <FormItem>
          <FormLabel class="text-sm font-medium text-zinc-950">
            Email
          </FormLabel>
          <FormControl>
            <Input
              placeholder="m@example.com"
              v-bind="componentField"
              :has-error="!!errors.length"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button class="mt-6! w-full" type="submit" :is-loading="isLoadingRecover">
        Recuperar senha
      </Button>
    </form>
  </div>
</template>
