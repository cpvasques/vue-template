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
import { InputPassword } from '@/shared/components/input-password'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { loginSchema } from '@/features/auth/login-auth/model/loginSchema'
import { useLogin } from '@/features/auth/login-auth/model/useLogin'
import type { Payload as LoginPayload } from '@/shared/api/auth-api/types/postLogin.types'

const router = useRouter()
const { postLogin } = useLogin()
const { mutate: postLoginMutate, isPending: isLoadingLogin } = postLogin()

const { handleSubmit, validate } = useForm({
  validationSchema: loginSchema,
  validateOnMount: false,
})

const onSubmit = async (values: LoginPayload) => {
  const { valid } = await validate()
  if (!valid) return toast.error('Preencha os campos corretamente')

  const loginPayload: LoginPayload = {
    email: values.email || '',
    password: values.password || '',
  }

  postLoginMutate(loginPayload, {
    onSuccess(res) {
      if (!res) return
      router.push({ name: 'TwoFactorAuth' })
    },
  })
}

const submitForm = handleSubmit(onSubmit)
</script>

<template>
  <div class="w-full sm:px-36 lg:px-60 xl:px-96">
    <h1 class="text-foreground mb-1 text-left text-2xl font-semibold">Login</h1>
    <p class="text-muted-foreground mb-6 text-left text-sm">
      Digite seu e-mail e senha para entrar
    </p>

    <form @submit.prevent="submitForm" class="space-y-4">
      <FormField v-slot="{ componentField, errors }" name="email">
        <FormItem>
          <FormLabel class="text-foreground text-sm font-medium">
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

      <FormField v-slot="{ componentField, errors }" name="password">
        <FormItem>
          <div class="flex items-center justify-start">
            <FormLabel class="text-foreground text-sm font-medium">
              Senha
            </FormLabel>
          </div>
          <FormControl>
            <InputPassword
              placeholder="Senha"
              v-bind="componentField"
              :has-error="!!errors.length"
            />
            <RouterLink
              to="/auth/recover-password"
              class="text-muted-foreground hover:text-accent-foreground text-sm font-normal underline"
            >
              Esqueci minha senha
            </RouterLink>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button class="mt-6! w-full" type="submit" :is-loading="isLoadingLogin">
        Entrar
      </Button>
    </form>

    <div
      class="mt-8 flex flex-col items-center justify-center gap-8 text-center"
    >
      <div class="flex w-full items-center justify-center gap-2">
        <div class="bg-border h-px w-full"></div>
        <span class="text-muted-foreground text-xs text-nowrap">
          Ainda não é cadastrado?
        </span>
        <div class="bg-border h-px w-full"></div>
      </div>

      <Button
        class="w-full"
        variant="outline"
        type="button"
        name="register-button"
      >
        Cadastre-se
      </Button>
    </div>

    <div class="text-muted-foreground mt-14 text-center text-xs">
      <a href="#" class="hover:underline">Termos de Serviço</a>
      <span class="mx-1">|</span>
      <a href="#" class="hover:underline">Política de Privacidade</a>
    </div>
  </div>
</template>
