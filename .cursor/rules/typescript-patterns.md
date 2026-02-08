---
description: Padrões TypeScript para APIs, tipos utilitários, generics e convenções de tipagem
globs: ['**/*.ts', '**/*.vue']
alwaysApply: true
---

# TypeScript Patterns

Diretrizes para uso de TypeScript seguindo padrões do projeto Vue 3 FSD.

## Quando Usar Esta Rule

Esta rule deve ser aplicada quando:
- Criando tipos para APIs
- Usando tipos utilitários
- Trabalhando com generics
- Inferindo tipos de schemas Zod
- Decidindo entre tipos explícitos e inferência
- Evitando uso de `any`

---

## Padrões de Tipos para APIs

**Estrutura completa:** `.cursor/rules/api-development.md` (seção "Estrutura de Tipos")

Resumo: `Payload`, `Response`, `Params` em arquivos `types/[endpoint].types.ts`. Tipos sempre em arquivo separado, nunca inline.

---

## Uso de `z.infer` para Tipos Derivados

### Padrão com Schemas Zod

**✅ SEMPRE usar `z.infer`** para tipos derivados de schemas Zod:

```typescript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// Inferir tipo automaticamente
export type LoginFormData = z.infer<typeof loginSchema>
```

**Uso no componente:**
```typescript
import type { LoginFormData } from './model/loginSchema'

const { handleSubmit } = useForm<LoginFormData>({
  validationSchema: loginSchema,
})

const onSubmit = (values: LoginFormData) => {
  // values está tipado corretamente
}
```

**Exemplo real:**
```typescript
// src/features/auth/login-auth/model/loginSchema.ts
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const loginSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(1),
  })
)

// Tipo derivado (se necessário)
// export type LoginFormData = z.infer<typeof loginSchema>
```

**Vantagens:**
- Tipo sempre sincronizado com schema
- Menos código duplicado
- Type-safe por padrão

---

## Tipos Utilitários Comuns

### `Pick<T, K>` - Selecionar Propriedades

```typescript
type User = {
  id: string
  name: string
  email: string
  password: string
}

// Selecionar apenas algumas propriedades
type PublicUser = Pick<User, 'id' | 'name' | 'email'>
// Resultado: { id: string; name: string; email: string }
```

**Uso prático:**
```typescript
// Criar tipo público sem senha
type PublicUser = Pick<User, 'id' | 'name' | 'email'>
```

### `Omit<T, K>` - Remover Propriedades

```typescript
type User = {
  id: string
  name: string
  email: string
  password: string
}

// Remover propriedades
type UserWithoutPassword = Omit<User, 'password'>
// Resultado: { id: string; name: string; email: string }
```

**Uso prático:**
```typescript
// Criar tipo sem propriedades sensíveis
type SafeUser = Omit<User, 'password' | 'token'>
```

### `Partial<T>` - Todas Propriedades Opcionais

```typescript
type User = {
  id: string
  name: string
  email: string
}

// Todas propriedades opcionais
type PartialUser = Partial<User>
// Resultado: { id?: string; name?: string; email?: string }
```

**Uso prático:**
```typescript
// Para updates parciais
type UpdateUserPayload = Partial<User>
```

### `Required<T>` - Todas Propriedades Obrigatórias

```typescript
type User = {
  id?: string
  name?: string
  email?: string
}

// Todas propriedades obrigatórias
type RequiredUser = Required<User>
// Resultado: { id: string; name: string; email: string }
```

### `Record<K, V>` - Objeto com Chaves Tipadas

```typescript
// Objeto com chaves string e valores number
type UserScores = Record<string, number>
// { [key: string]: number }

// Objeto com chaves específicas
type StatusMap = Record<'pending' | 'approved' | 'rejected', string>
// { pending: string; approved: string; rejected: string }
```

---

## Quando Criar Tipos vs Usar Inferência

### Criar Tipos Explícitos Para

**✅ APIs:**
```typescript
// Sempre criar tipos explícitos para APIs
export type Payload = { email: string; password: string }
export type Response = { token: string; user: User }
```

**✅ Props de Componentes:**
```typescript
// Tipos explícitos para props
interface Props {
  title: string
  count: number
  items: Item[]
}
```

**✅ Interfaces Públicas:**
```typescript
// Tipos que são exportados e usados em múltiplos lugares
export type User = { id: string; name: string }
```

### Usar Inferência Para

**✅ Valores Locais:**
```typescript
// TypeScript infere automaticamente
const user = { id: '1', name: 'John' } // { id: string; name: string }
```

**✅ Schemas Zod:**
```typescript
// Usar z.infer para tipos derivados
export type FormData = z.infer<typeof schema>
```

**✅ Retornos de Funções Simples:**
```typescript
// TypeScript infere o retorno
function getValue() {
  return { value: 42 } // Retorno inferido
}
```

### Critérios de Decisão

**Criar tipo explícito quando:**
- Tipo é usado em múltiplos lugares
- Tipo é exportado
- Tipo precisa de documentação
- Tipo é complexo e beneficia de nomeação

**Usar inferência quando:**
- Tipo é usado apenas localmente
- Tipo é simples e óbvio
- Tipo deriva de outro (usar `z.infer`, `Pick`, etc)

---

## Padrões de Generics

### Quando Usar Generics

**✅ Composables Reutilizáveis:**
```typescript
function useApi<TData, TPayload = unknown>(
  endpoint: string
) {
  const { data } = useQuery<TData>({
    queryKey: [endpoint],
    queryFn: () => fetch(endpoint).then(r => r.json()),
  })
  
  const { mutate } = useMutation<TData, Error, TPayload>({
    mutationFn: (payload) => 
      fetch(endpoint, { body: JSON.stringify(payload) }).then(r => r.json()),
  })
  
  return { data, mutate }
}
```

**✅ Funções Utilitárias:**
```typescript
function getValue<T>(obj: Record<string, T>, key: string): T | undefined {
  return obj[key]
}
```

**✅ Componentes Genéricos:**
```typescript
interface Props<T> {
  items: T[]
  renderItem: (item: T) => VNode
}
```

### Exemplos Práticos

```typescript
// Composable genérico para listagem
function useList<TData, TParams = Record<string, unknown>>(
  queryKey: string[],
  queryFn: (params: TParams) => Promise<TData>
) {
  const params = ref<TParams>({} as TParams)
  
  const { data, isLoading } = useQuery<TData>({
    queryKey: [...queryKey, params],
    queryFn: () => queryFn(params.value),
  })
  
  return { data, isLoading, params }
}
```

---

## Evitar `any` e Alternativas

### ❌ NUNCA Usar `any`

```typescript
// ❌ ERRADO
function processData(data: any) { }
const value: any = getValue()
```

### ✅ Alternativas ao `any`

**`unknown` - Quando tipo é desconhecido:**
```typescript
// ✅ CORRETO - Precisa fazer type guard
function processData(data: unknown) {
  if (typeof data === 'string') {
    // TypeScript sabe que data é string aqui
    console.log(data.toUpperCase())
  }
}
```

**`Record<string, unknown>` - Para objetos genéricos:**
```typescript
// ✅ CORRETO
function processObject(obj: Record<string, unknown>) {
  // Objeto com chaves string e valores desconhecidos
}
```

**Tipos Específicos - Quando possível:**
```typescript
// ✅ CORRETO - Tipo específico
function processUser(user: User) { }

// ✅ CORRETO - Union type
function processValue(value: string | number) { }
```

**Type Assertions Seguras:**
```typescript
// ✅ CORRETO - Com verificação
function processData(data: unknown) {
  if (isUser(data)) {
    // Type guard garante tipo
    console.log(data.name)
  }
}

function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'name' in data
}
```

### Configuração ESLint

O projeto tem `@typescript-eslint/no-explicit-any: 'off'` mas **não significa que devemos usar `any`**.

**Preferir sempre:**
- Tipos específicos
- `unknown` quando necessário
- `Record<string, unknown>` para objetos genéricos

---

## Tipos para Vue

### Props

**✅ Usar `defineProps<Type>()`:**
```typescript
interface Props {
  title: string
  count?: number
  items: Item[]
}

const props = defineProps<Props>()
```

**✅ Com valores padrão:**
```typescript
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
})
```

### Emits

**✅ Usar `defineEmits<{ event: [payload] }>()`:**
```typescript
const emit = defineEmits<{
  update: [value: string]
  delete: [id: string]
}>()

emit('update', 'new value')
emit('delete', '123')
```

### Refs

**✅ Tipos para refs:**
```typescript
const count = ref<number>(0) // Ref<number>
const user = ref<User | null>(null) // Ref<User | null>
const items = ref<Item[]>([]) // Ref<Item[]>
```

**✅ Computed refs:**
```typescript
const doubled = computed<number>(() => count.value * 2) // ComputedRef<number>
```

### Component Refs

**✅ Tipos para refs de componentes:**
```typescript
import Component from './Component.vue'

const componentRef = ref<InstanceType<typeof Component> | null>(null)

// Usar métodos expostos
componentRef.value?.exposedMethod()
```

**✅ Com `defineExpose`:**
```typescript
// No componente filho
defineExpose({
  submitForm: () => { },
  resetForm: () => { },
})

// No componente pai
const formRef = ref<InstanceType<typeof FormComponent> | null>(null)
formRef.value?.submitForm()
```

---

## Checklist de Implementação

Ao trabalhar com TypeScript:

- [ ] Tipos de API sempre em arquivos separados
- [ ] Usar `z.infer` para tipos derivados de schemas
- [ ] Preferir tipos específicos sobre `any`
- [ ] Usar tipos utilitários quando apropriado
- [ ] Tipar props, emits e refs corretamente
- [ ] Usar generics para código reutilizável
- [ ] Evitar `any`, usar `unknown` ou tipos específicos

---

## Exemplos Completos

### Tipo de API Completo

```typescript
// shared/api/users-api/types/getAllUsers.types.ts
export type Params = {
  page?: number
  perPage?: number
}

export type Pagination = {
  page: number
  pages: number
  perPage: number
  total: number
}

export type User = {
  id: string
  name: string
  email: string
  phone: string
  status: boolean
  createdAt: string
  avatar?: string
}

export type Response = {
  users: User[]
  pagination: Pagination
}
```

### Tipo Derivado de Schema

```typescript
// features/auth/login-auth/model/loginSchema.ts
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

export const loginSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
)

export type LoginFormData = z.infer<typeof loginSchema>
```

### Componente Tipado

```typescript
// Component.vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  items: Item[]
}

interface Emits {
  update: [value: string]
  delete: [id: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const count = ref<number>(props.count || 0)
const doubled = computed<number>(() => count.value * 2)
</script>
```

---

## Recursos Relacionados

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Zod Type Inference](https://zod.dev/?id=type-inference)
