# Templates de Formulários

Templates prontos para copiar e adaptar ao criar novos formulários.

## Template: Formulário Simples

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/form'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'

import { featureSchema } from './model/featureSchema'
import { useFeature } from './model/useFeature'
import type { Payload } from '@/shared/api/feature-api/types/action.types'

const { action } = useFeature()
const { mutate, isPending } = action()

const { handleSubmit, validate } = useForm({
  validationSchema: featureSchema,
  validateOnMount: false,
})

const onSubmit = async (values: FormData) => {
  const { valid } = await validate()
  if (!valid) return toast.error('Preencha os campos corretamente')

  const payload: Payload = {
    field1: values.field1 || '',
    field2: values.field2 || '',
  }

  mutate(payload, {
    onSuccess: () => {
      toast.success('Operação realizada com sucesso')
    },
  })
}

const submitForm = handleSubmit(onSubmit)
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <FormField v-slot="{ componentField, errors }" name="field1">
      <FormItem>
        <FormLabel class="text-foreground text-sm font-medium">
          Campo 1
        </FormLabel>
        <FormControl>
          <Input
            placeholder="Digite o valor"
            v-bind="componentField"
            :has-error="!!errors.length"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField, errors }" name="field2">
      <FormItem>
        <FormLabel class="text-foreground text-sm font-medium">
          Campo 2
        </FormLabel>
        <FormControl>
          <Input
            placeholder="Digite o valor"
            v-bind="componentField"
            :has-error="!!errors.length"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" :is-loading="isPending" class="w-full">
      Enviar
    </Button>
  </form>
</template>
```

## Template: Formulário de Login

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
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

import { loginSchema } from './model/loginSchema'
import { useLogin } from './model/useLogin'
import type { Payload } from '@/shared/api/auth-api/types/postLogin.types'

const router = useRouter()
const { postLogin } = useLogin()
const { mutate, isPending } = postLogin()

const { handleSubmit, validate } = useForm({
  validationSchema: loginSchema,
  validateOnMount: false,
})

const onSubmit = async (values: Payload) => {
  const { valid } = await validate()
  if (!valid) return toast.error('Preencha os campos corretamente')

  const payload: Payload = {
    email: values.email || '',
    password: values.password || '',
  }

  mutate(payload, {
    onSuccess: (response) => {
      if (!response) return
      router.push({ name: 'Dashboard' })
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

    <Button type="submit" :is-loading="isPending" class="w-full">
      Entrar
    </Button>
  </form>
</template>
```

## Template: Schema Zod Simples

```typescript
// features/[feature]/model/[feature]Schema.ts
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

export const featureSchema = toTypedSchema(
  z.object({
    email: z
      .string({ message: 'E-mail é obrigatório.' })
      .min(1, { message: 'E-mail é obrigatório.' })
      .email({ message: 'E-mail deve ser válido.' }),
    password: z
      .string({ message: 'Senha é obrigatória.' })
      .min(1, { message: 'Senha é obrigatória.' }),
  })
)

export type FeatureFormData = z.infer<typeof featureSchema>
```

## Template: Schema com Validação Condicional

```typescript
// features/[feature]/model/[feature]Schema.ts
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

export const featureSchema = toTypedSchema(
  z.object({
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres.'),
    confirmPassword: z.string().min(8, 'Confirme sua senha.'),
  }).superRefine((values, ctx) => {
    const { password, confirmPassword } = values

    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'As senhas precisam ser iguais.',
      })
    }
  })
)

export type FeatureFormData = z.infer<typeof featureSchema>
```

## Template: Composable com Validação

```typescript
// features/[feature]/model/useFeature.ts
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { actionService } from '@/shared/api/feature-api/action'
import type { Payload } from '@/shared/api/feature-api/types/action.types'

const action = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: Payload) =>
      actionService(payload).catch((error) => {
        toast.error(error?.response?.data?.message || 'Erro desconhecido.')
        throw error
      }),
  })

  return { isPending, isError, error, isSuccess, mutate }
}

export function useFeature() {
  return { action }
}
```

## Como Usar os Templates

1. **Copie o template** mais adequado para seu caso
2. **Adapte os nomes** de componentes, schemas e composables
3. **Ajuste os campos** conforme necessário
4. **Adicione validações** específicas no schema
5. **Personalize mensagens** de erro e sucesso

## Dicas

- Use templates como ponto de partida
- Mantenha consistência com padrões do projeto
- Adicione campos conforme necessário
- Teste validações antes de finalizar
