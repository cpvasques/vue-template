# Schemas de Validação Zod

Padrões para criação de schemas Zod com integração VeeValidate e i18n.

## Setup Básico

### Estrutura de Schema

```typescript
// features/[feature]/model/[feature]Schema.ts
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

export const featureSchema = toTypedSchema(
  z.object({
    field1: z.string().min(1, 'Campo obrigatório'),
    field2: z.string().email('Email inválido'),
  })
)

export type FeatureFormData = z.infer<typeof featureSchema>
```

**Importante:** Sempre usar `toTypedSchema` para integração com VeeValidate.

## Validações Básicas

### String

```typescript
z.string()                    // String qualquer
z.string().min(1)             // Mínimo 1 caractere
z.string().min(1, 'Mensagem') // Com mensagem customizada
z.string().max(100)          // Máximo 100 caracteres
z.string().email()            // Email válido
z.string().url()              // URL válida
```

### Number

```typescript
z.number()                    // Número qualquer
z.number().min(0)             // Mínimo 0
z.number().max(100)           // Máximo 100
z.number().positive()         // Número positivo
z.number().int()              // Número inteiro
```

### Boolean

```typescript
z.boolean()                   // Boolean
z.boolean().refine(val => val === true, 'Deve ser verdadeiro')
```

## Validações Comuns

### Email

```typescript
z.string()
  .min(1, 'E-mail é obrigatório.')
  .email('E-mail deve ser válido.')
```

### Senha

```typescript
z.string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
```

### Senha com Regex Customizado

```typescript
import { passwordRegex } from '@/app/utils/passwordRegex'

z.string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .regex(passwordRegex, {
    message: 'A senha deve seguir as regras de segurança.',
  })
```

## Validação Condicional

### Validação com `refine`

```typescript
z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'], // Campo que receberá o erro
})
```

### Validação com `superRefine`

```typescript
z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
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
```

**Exemplo real do projeto:**
```typescript
// src/features/auth/new-password-auth/model/newPasswordSchema.ts
export const newPasswordSchema = toTypedSchema(
  z.object({
    password: z.string().min(8, '...').regex(passwordRegex, {...}),
    confirmPassword: z.string().min(8, '...').regex(passwordRegex, {...}),
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
```

## Campos Opcionais

### Opcional Simples

```typescript
z.string().optional()         // Campo opcional
z.string().nullable()         // Pode ser null
z.string().nullish()          // Pode ser null ou undefined
```

### Opcional com Validação

```typescript
z.string()
  .optional()
  .refine((val) => !val || val.length >= 3, {
    message: 'Se preenchido, deve ter no mínimo 3 caracteres',
  })
```

## Mensagens de Erro

### Mensagens Customizadas

```typescript
z.string({
  required_error: 'Campo obrigatório',
  invalid_type_error: 'Deve ser uma string',
})
  .min(1, 'Campo obrigatório')
  .email('Email inválido')
```

### Mensagens com i18n

O projeto usa `zod-i18n-map` para mensagens traduzidas automaticamente:

```typescript
// Mensagens padrão do zod-i18n-map são usadas automaticamente
z.string().email() // "E-mail inválido" (traduzido automaticamente)
```

Para mensagens customizadas, ainda usar strings:

```typescript
z.string().email('E-mail deve ser válido.') // Mensagem customizada
```

## Schemas Compostos

### Schema com Múltiplos Campos

```typescript
export const userSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Nome é obrigatório.'),
    email: z.string().min(1, 'E-mail é obrigatório.').email('E-mail inválido.'),
    phone: z.string().optional(),
    age: z.number().min(18, 'Idade mínima é 18 anos.').optional(),
  })
)
```

### Schema Aninhado

```typescript
export const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
})

export const userWithAddressSchema = toTypedSchema(
  z.object({
    name: z.string().min(1),
    email: z.string().email(),
    address: addressSchema, // Schema aninhado
  })
)
```

## Reutilização de Schemas

### Schemas Base

```typescript
// shared/schemas/base.ts
export const emailSchema = z.string().email('E-mail inválido.')
export const passwordSchema = z.string().min(8, 'Senha deve ter no mínimo 8 caracteres.')

// features/auth/login-auth/model/loginSchema.ts
import { emailSchema, passwordSchema } from '@/shared/schemas/base'

export const loginSchema = toTypedSchema(
  z.object({
    email: emailSchema,
    password: passwordSchema,
  })
)
```

## Tipos Derivados

### Inferir Tipo do Schema

```typescript
import { z } from 'zod'

const featureSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// Inferir tipo automaticamente
export type FeatureFormData = z.infer<typeof featureSchema>

// Uso no componente
const { handleSubmit } = useForm<FeatureFormData>({
  validationSchema: featureSchema,
})
```

## Exemplos Reais do Projeto

### Login Schema

```typescript
// src/features/auth/login-auth/model/loginSchema.ts
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const loginSchema = toTypedSchema(
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
```

### New Password Schema

```typescript
// src/features/auth/new-password-auth/model/newPasswordSchema.ts
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { passwordRegex } from '@/app/utils/passwordRegex'

export const newPasswordSchema = toTypedSchema(
  z.object({
    password: z
      .string({ message: 'Senha é obrigatório.' })
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
      .regex(passwordRegex, {
        message: 'A senha deve seguir as regras de segurança.',
      }),
    confirmPassword: z
      .string({ message: 'Confirme sua senha.' })
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
      .regex(passwordRegex, {
        message: 'A senha deve seguir as regras de segurança.',
      }),
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
```

## Boas Práticas

### ✅ FAZER

- Sempre usar `toTypedSchema` para integração VeeValidate
- Usar mensagens descritivas em português
- Validar campos obrigatórios com `.min(1)`
- Usar `z.infer` para tipos derivados
- Reutilizar schemas quando possível
- Usar `superRefine` para validações complexas

### ❌ NÃO FAZER

- Não esquecer de usar `toTypedSchema`
- Não usar mensagens genéricas ("Erro", "Inválido")
- Não criar schemas muito complexos (dividir quando necessário)
- Não duplicar validações (reutilizar schemas)

## Recursos Adicionais

- [Zod Docs](https://zod.dev/)
- [Zod Validation](https://zod.dev/?id=primitives)
- [zod-i18n-map](https://github.com/aiji42/zod-i18n-map)
