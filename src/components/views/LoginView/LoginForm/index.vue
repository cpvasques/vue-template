<script setup lang="ts">
import { useForm } from 'vee-validate'

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form/index.ts'
import { formSchema } from '@/composables/auth/useAuth.schemas.ts'
import { useAuth } from '@/composables/auth/useAuth.ts'

const { postLogin } = useAuth()
const { mutate: postLoginMutate, isPending: isLoadingLogin } = postLogin()

const { handleSubmit } = useForm({
  validationSchema: formSchema,
  validateOnMount: false,
  validateOnChange: false,
  validateOnInput: false,
})

const onSubmit = handleSubmit((values) => {
  postLoginMutate(values, {
    onSuccess(resp) {
      if (!resp) return

      router.push('/')
    },
  })
})
</script>

<template>
  <form class="grid grid-cols-12 gap-5 justify-end items-center" @submit.prevent="onSubmit">
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
      >Entrar</Button
    >
  </form>
</template>
