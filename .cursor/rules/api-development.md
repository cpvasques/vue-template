---
description: Padrões de desenvolvimento de APIs, uso de adapters HTTP, interceptors e integração com Vue Query
globs: ['**/shared/api/**', '**/features/**/model/use*.ts']
alwaysApply: true
---

# API Development Patterns

Diretrizes para desenvolvimento de APIs seguindo padrões do projeto Vue 3 FSD.

## Quando Usar Esta Rule

Esta rule deve ser aplicada quando:
- Criando novos endpoints de API
- Modificando APIs existentes
- Criando composables que usam APIs
- Configurando interceptors
- Definindo tipos de API
- Trabalhando com Vue Query

---

## Escolha do Adapter HTTP

### axiosClient (Padrão)

**✅ SEMPRE usar `axiosClient`** como padrão para todas as APIs.

```typescript
import { axiosClient } from '@/shared/api/config/http-client'
import type { Payload, Response } from './types/postLogin.types'

export async function postLogin(payload: Payload): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: 'login',
    method: 'POST',
    body: payload,
  })
  return response.data
}
```

### fetchClient (Alternativa)

**⚠️ Usar `fetchClient` apenas quando:**
- Necessário para casos específicos (ex: streaming, WebSockets)
- Requisito técnico específico do projeto
- Performance crítica que justifique uso de Fetch API nativo

```typescript
import { fetchClient } from '@/shared/api/config/http-client'
import type { Payload, Response } from './types/postLogin.types'

export async function postLoginWithFetch(payload: Payload): Promise<Response> {
  const response = await fetchClient.request<Response>({
    endpoint: 'login',
    method: 'POST',
    body: payload,
  })
  return response.data
}
```

**Padrão:** Use `axiosClient` por padrão. Documente motivo se usar `fetchClient`.

---

## Estrutura de Endpoints

### Uma Função por Arquivo

**✅ CORRETO:**
```
shared/api/users-api/
├── getAllUsers.ts
├── getUserById.ts
├── postNewUser.ts
├── updateUser.ts
└── deleteUser.ts
```

**❌ ERRADO:**
```
shared/api/users-api/
└── users.ts  // Múltiplas funções em um arquivo
```

### Nomenclatura

**Padrão:** `[method][Resource].ts`

- `getAllUsers.ts` - GET lista de recursos
- `getUserById.ts` - GET recurso específico
- `postNewUser.ts` - POST criar recurso
- `updateUser.ts` - PUT/PATCH atualizar recurso
- `deleteUser.ts` - DELETE remover recurso

**Exemplos do projeto:**
- `postLogin.ts`
- `getAllUsers.ts`
- `postNewPassword.ts`
- `deleteUser.ts`

### Estrutura de Arquivo

```typescript
// shared/api/[domain]-api/[method][Resource].ts
import { axiosClient } from '../config/http-client'
import type { Payload, Response } from './types/[method][Resource].types'

export async function [method][Resource](payload: Payload): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: '[resource]',
    method: '[METHOD]',
    body: payload, // Para POST, PUT, PATCH
    params: payload, // Para GET com query params
  })
  return response.data
}
```

**Exemplo real:**
```typescript
// shared/api/users-api/getAllUsers.ts
import { axiosClient } from '../config/http-client'
import type { Params, Response } from './types/getAllUsers.types'

export async function getAllUsers(params: Params): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: 'users',
    method: 'GET',
    params,
  })
  return response.data
}
```

---

## Estrutura de Tipos

### Tipos Sempre em Arquivo Separado

**✅ CORRETO:**
```
shared/api/users-api/
├── getAllUsers.ts
└── types/
    └── getAllUsers.types.ts
```

**❌ ERRADO:**
```typescript
// Tipos inline no mesmo arquivo
export async function getAllUsers(params: { page: number }) { }
```

### Convenções de Nomenclatura

**Padrão:** `types/[endpoint].types.ts`

- `types/postLogin.types.ts`
- `types/getAllUsers.types.ts`
- `types/updateUser.types.ts`

### Estrutura de Tipos

```typescript
// types/[endpoint].types.ts

// Payload para requisições (POST, PUT, PATCH)
export type Payload = {
  field1: string
  field2: number
}

// Params para query parameters (GET)
export type Params = {
  page?: number
  perPage?: number
  filter?: string
}

// Response da API
export type Response = {
  id: string
  name: string
  // ...
}

// Tipos auxiliares (se necessário)
export type User = {
  id: string
  name: string
  email: string
}
```

**Exemplo real:**
```typescript
// types/getAllUsers.types.ts
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

### Tipos Compartilhados

Quando tipos são usados em múltiplos endpoints, criar em:
```
shared/api/[domain]-api/types/
├── shared.types.ts  // Tipos compartilhados
└── [endpoint].types.ts
```

---

## Tratamento de Erros

**Consultar `.cursor/rules/error-handling.md`** para padrões completos. Resumo em composables:

```typescript
mutationFn: (payload: Payload) =>
  postLoginService(payload).catch((error) => {
    toast.error(error?.response?.data?.message || 'Erro desconhecido.')
    throw error // Re-throw obrigatório
  }),
```

---

## Interceptors

### Bearer Token Interceptor

**✅ Automático** - Não precisa fazer nada manualmente.

O interceptor adiciona automaticamente o token Bearer em todas as requisições:

```typescript
// shared/api/config/interceptors/handleBearer.ts
// Configurado automaticamente em http-client.ts
```

**Como funciona:**
1. Busca token de `localStorage.getItem('token')` ou `sessionStorage.getItem('token')`
2. Adiciona header `Authorization: Bearer {token}` automaticamente
3. Funciona para `axiosClient` e `fetchClient`

**Não precisa:**
```typescript
// ❌ NÃO fazer isso manualmente
headers: {
  Authorization: `Bearer ${token}` // Interceptor já faz isso
}
```

### Unauthorized Interceptor

**✅ Automático** - Trata 401/403 automaticamente.

O interceptor trata respostas 401/403:
1. Remove tokens do storage
2. Exibe toast de erro
3. (Opcional) Redireciona para login (atualmente comentado)

```typescript
// shared/api/config/interceptors/handleUnauthorized.ts
// Configurado automaticamente em http-client.ts
```

**Comportamento:**
- Intercepta respostas 401/403
- Remove `localStorage.token` e `sessionStorage.token`
- Exibe toast com mensagem de erro
- Re-throw do erro para composable tratar

### Criar Novos Interceptors

**Quando criar:**
- Lógica específica de transformação de requisições/respostas
- Logging de requisições
- Retry automático
- Transformação de dados

**Onde criar:**
```
shared/api/config/interceptors/
├── handleBearer.ts
├── handleUnauthorized.ts
└── [novo-interceptor].ts
```

**Como configurar:**
```typescript
// shared/api/config/http-client.ts
import { addBearerTokenInterceptor } from './interceptors/handleBearer'
import { unauthorizedTokenInterceptor } from './interceptors/handleUnauthorized'
import { novoInterceptor } from './interceptors/novo-interceptor'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
})

addBearerTokenInterceptor(axiosInstance)
unauthorizedTokenInterceptor(axiosInstance)
novoInterceptor(axiosInstance) // Adicionar novo interceptor
```

---

## Padrões de Query Keys para Vue Query

### Estrutura de Query Keys

**Padrão:** `['resource', ...filters]`

```typescript
// Query simples
queryKey: ['users']

// Query com parâmetros
queryKey: ['users', currentPage, perPage]

// Query com filtros reativos
queryKey: ['users', currentPage, perPage, filters]
```

**Exemplo real:**
```typescript
// features/users/list-users/model/useListUsers.ts
const { data, isLoading } = useQuery({
  queryKey: ['getAllUsers', currentPage, perPage, filters],
  queryFn: () => getAllUsersService(params.value),
})
```

### Query Keys Reativos

**✅ CORRETO - Usar refs/computed:**
```typescript
const currentPage = ref(1)
const perPage = ref(10)
const filters = ref({})

const { data } = useQuery({
  queryKey: ['users', currentPage, perPage, filters], // Reativo
  queryFn: () => getAllUsers({ page: currentPage.value, perPage: perPage.value }),
})
```

**❌ ERRADO - Valores estáticos:**
```typescript
const { data } = useQuery({
  queryKey: ['users', 1, 10], // Não reativo
  queryFn: () => getAllUsers({ page: 1, perPage: 10 }),
})
```

### Invalidação de Queries

**Padrão após mutations:**
```typescript
import { useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()

const { mutate } = useMutation({
  mutationFn: postNewUser,
  onSuccess: () => {
    // Invalidar queries relacionadas
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

**Invalidação seletiva:**
```typescript
// Invalidar apenas queries específicas
queryClient.invalidateQueries({ 
  queryKey: ['users'],
  exact: false, // Invalida todas as queries que começam com ['users']
})
```

---

## Organização de APIs

### Estrutura por Domínio

```
shared/api/
├── auth-api/
│   ├── postLogin.ts
│   ├── postTwoFactor.ts
│   └── types/
│       ├── postLogin.types.ts
│       └── postTwoFactor.types.ts
├── users-api/
│   ├── getAllUsers.ts
│   ├── getUserById.ts
│   └── types/
│       └── getAllUsers.types.ts
└── config/
    ├── http-client.ts
    └── interceptors/
        ├── handleBearer.ts
        └── handleUnauthorized.ts
```

### Convenções de Domínio

- **auth-api/** - Autenticação e autorização
- **users-api/** - Gerenciamento de usuários
- **profile-api/** - Perfil do usuário
- **[domain]-api/** - Outros domínios

**Padrão:** `[domain]-api/` em kebab-case.

---

## Checklist de Implementação

Ao criar um novo endpoint:

- [ ] Criar arquivo `[method][Resource].ts` em `shared/api/[domain]-api/`
- [ ] Criar tipos em `types/[method][Resource].types.ts`
- [ ] Usar `axiosClient.request<T>()` com tipos corretos
- [ ] Retornar `response.data` diretamente
- [ ] Tratar erros no composable (não no endpoint)
- [ ] Usar query keys reativos no Vue Query
- [ ] Invalidar queries relacionadas após mutations
- [ ] Seguir nomenclatura padrão

---

## Exemplos Completos

### GET com Parâmetros

```typescript
// shared/api/users-api/getAllUsers.ts
import { axiosClient } from '../config/http-client'
import type { Params, Response } from './types/getAllUsers.types'

export async function getAllUsers(params: Params): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: 'users',
    method: 'GET',
    params,
  })
  return response.data
}
```

### POST com Body

```typescript
// shared/api/auth-api/postLogin.ts
import { axiosClient } from '../config/http-client'
import type { Payload, Response } from './types/postLogin.types'

export async function postLogin(payload: Payload): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: 'login',
    method: 'POST',
    body: payload,
  })
  return response.data
}
```

### Composable com Tratamento de Erro

```typescript
// features/auth/login-auth/model/useLogin.ts
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { postLogin as postLoginService } from '@/shared/api/auth-api/postLogin'
import type { Payload } from '@/shared/api/auth-api/types/postLogin.types'

const postLogin = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: Payload) =>
      postLoginService(payload).catch((error) => {
        toast.error(error?.response?.data?.message || 'Erro desconhecido.')
        throw error
      }),
  })

  return { isPending, isError, error, isSuccess, mutate }
}

export function useLogin() {
  return { postLogin }
}
```

---

## Recursos Relacionados

- [Vue Query Docs](https://tanstack.com/query/v5/docs/framework/vue/overview)
- [Axios Docs](https://axios-http.com/docs/intro)
- [Fetch API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
