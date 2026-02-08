# Padrões de Formulários

Estruturação e padrões para criação de formulários Vue com VeeValidate.

## Setup Básico

### Importações Padrão

```typescript
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
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
import { toast } from 'vue-sonner'

import { featureSchema } from './model/featureSchema'
import { useFeature } from './model/useFeature'
```

### Setup do Form

```typescript
const { handleSubmit, validate } = useForm({
  validationSchema: featureSchema,
  validateOnMount: false, // Não validar ao montar
})
```

## Estrutura de Formulário

### Template Básico

```vue
<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <FormField v-slot="{ componentField, errors }" name="fieldName">
      <FormItem>
        <FormLabel class="text-foreground text-sm font-medium">
          Label do Campo
        </FormLabel>
        <FormControl>
          <Input
            placeholder="Placeholder"
            v-bind="componentField"
            :has-error="!!errors.length"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" :is-loading="isPending">
      Enviar
    </Button>
  </form>
</template>
```

### Campo de Texto

```vue
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
```

### Campo de Senha

```vue
<FormField v-slot="{ componentField, errors }" name="password">
  <FormItem>
    <FormLabel class="text-foreground text-sm font-medium">
      Senha
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
```

## Padrão de Submit

### Validação Antes de Submeter

```typescript
const onSubmit = async (values: FormData) => {
  // Validar antes de submeter
  const { valid } = await validate()
  if (!valid) {
    return toast.error('Preencha os campos corretamente')
  }

  // Preparar payload
  const payload: Payload = {
    field1: values.field1 || '',
    field2: values.field2 || '',
  }

  // Submeter
  mutate(payload, {
    onSuccess: (response) => {
      // Tratar sucesso
      toast.success('Operação realizada com sucesso')
      // Redirecionar ou resetar formulário
    },
  })
}

const submitForm = handleSubmit(onSubmit)
```

### Loading State

```typescript
const { mutate, isPending } = useMutation({...})

// No template
<Button type="submit" :is-loading="isPending">
  Enviar
</Button>
```

## Exemplo Real do Projeto

Baseado em `src/features/auth/login-auth/index.vue`:

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { useLogin } from '@/features/auth/login-auth/model/useLogin'
import { loginSchema } from '@/features/auth/login-auth/model/loginSchema'
import type { Payload as LoginPayload } from '@/shared/api/auth-api/types/postLogin.types'

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
        <FormLabel class="text-foreground text-sm font-medium">
          Senha
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

    <Button class="mt-6! w-full" type="submit" :is-loading="isLoadingLogin">
      Entrar
    </Button>
  </form>
</template>
```

## Formulários com Máscaras

### Usando Maska

```vue
<script setup lang="ts">
import { vMaska } from 'maska'
</script>

<template>
  <FormField v-slot="{ componentField, errors }" name="phone">
    <FormItem>
      <FormLabel>Telefone</FormLabel>
      <FormControl>
        <Input
          v-maska="'(##) #####-###'"
          v-bind="componentField"
          :has-error="!!errors.length"
          placeholder="(11) 99999-9999"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
```

## Formulários Dinâmicos

### Loop de Campos

```vue
<template>
  <div class="grid grid-cols-6 gap-5">
    <FormField
      v-for="field in formFields"
      :key="field.name"
      v-slot="{ componentField, errors }"
      :name="field.name"
    >
      <FormItem :class="field.grow">
        <FormLabel>{{ field.label }}</FormLabel>
        <FormControl>
          <Input
            v-maska="field.mask"
            v-bind="componentField"
            :has-error="!!errors.length"
            :placeholder="field.placeholder"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>
```

## Reset de Formulário

### Reset Após Sucesso

```typescript
const { handleSubmit, validate, resetForm } = useForm({
  validationSchema: featureSchema,
})

const onSubmit = async (values: FormData) => {
  const { valid } = await validate()
  if (!valid) return

  mutate(payload, {
    onSuccess: () => {
      resetForm() // Resetar formulário após sucesso
      toast.success('Formulário enviado com sucesso')
    },
  })
}
```

## Boas Práticas

### ✅ FAZER

- Usar `validateOnMount: false` por padrão
- Validar antes de submeter com `validate()`
- Usar `v-bind="componentField"` para binding correto
- Passar `:has-error="!!errors.length"` para feedback visual
- Sempre incluir `<FormMessage />` para exibir erros
- Usar toast para feedback de submit
- Tipar valores do formulário

### ❌ NÃO FAZER

- Não validar ao montar (`validateOnMount: true`)
- Não esquecer de passar `componentField` para inputs
- Não esquecer de exibir erros com `FormMessage`
- Não submeter sem validar primeiro
- Não usar `v-model` diretamente (usar `componentField`)

## Recursos Adicionais

- [VeeValidate Form Handling](https://vee-validate.logaretm.com/v4/guide/overview)
- [VeeValidate Composition API](https://vee-validate.logaretm.com/v4/guide/composition-api/overview)
