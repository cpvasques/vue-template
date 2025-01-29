<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form/index'
import { useAuth } from '@/composables/auth/useAuth'
import { formSchema } from '@/composables/auth/useAuth.schemas'
import type { Params } from '@/services/auth/postLogin.types'

const router = useRouter()
const { postLogin } = useAuth()
const { mutate: postLoginMutate, isPending: isLoadingLogin } = postLogin()

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  validateOnMount: false,
})

const onSubmit = handleSubmit((values) => {
  const loginPayload: Params = {
    email: values.email || '',
    password: values.password || '',
  }

  postLoginMutate(loginPayload, {
    onSuccess(res) {
      if (!res) return

      router.push('/')
    },
  })
})
</script>

<template>
  <form class="grid grid-cols-12 items-center justify-end gap-5" @submit.prevent="onSubmit">
    <FormField v-slot="{ componentField, errors }" name="email">
      <FormItem class="col-span-12">
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            placeholder="Email"
            v-bind="componentField"
            :has-error="!!errors.length"
            has-own-label
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField, errors }" name="password">
      <FormItem class="col-span-12">
        <FormLabel>Senha</FormLabel>
        <FormControl>
          <InputPassword placeholder="Senha" v-bind="componentField" :has-error="!!errors.length" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button
      class="col-span-12 md:col-span-4 md:col-start-9"
      type="submit"
      :is-loading="isLoadingLogin"
    >
      Entrar
    </Button>
  </form>
</template>
