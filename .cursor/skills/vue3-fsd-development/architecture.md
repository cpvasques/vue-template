# Arquitetura FSD - Feature-Sliced Design

Detalhamento completo da arquitetura Feature-Sliced Design adaptada para este projeto Vue 3.

## Visão Geral

A arquitetura FSD organiza o código em camadas verticais (slices) e horizontais (layers), garantindo escalabilidade e manutenibilidade.

## Estrutura de Camadas

### Hierarquia de Dependências

```
┌─────────┐
│   app/  │ ← Não depende de ninguém
└────┬────┘
     │
┌────▼────┐
│ pages/  │ ← Depende de: features, widgets, shared
└────┬────┘
     │
┌────▼────┐
│features/│ ← Depende de: widgets, shared
└────┬────┘
     │
┌────▼────┐
│widgets/ │ ← Depende de: shared
└────┬────┘
     │
┌────▼────┐
│ shared/ │ ← Não depende de ninguém
└─────────┘
```

## Camadas Detalhadas

### `app/` - Core da Aplicação

**Responsabilidade**: Configuração e inicialização da aplicação.

**Estrutura:**
```
app/
├── main.ts                    # Ponto de entrada
├── App.vue                    # Componente raiz
├── providers/                 # Providers globais
│   └── router/
│       └── index.ts          # Configuração de rotas
├── middlewares/              # Middlewares de roteamento
│   ├── requireAuth.ts
│   └── keepConnected.ts
├── plugins/                   # Plugins Vue
│   ├── pinia.ts
│   ├── vueQuery.ts
│   ├── i18n-zod.ts
│   └── maska.ts
├── api/                       # Adaptadores HTTP
│   ├── axios-adapter.ts
│   ├── fetch-adapter.ts
│   └── types/
└── utils/                     # Utilitários globais
    ├── cn.ts
    ├── decodeJwt.ts
    └── passwordRegex.ts
```

**Regras:**
- ✅ Pode importar apenas de `node_modules`
- ❌ NUNCA importar de outras camadas (`pages/`, `features/`, `widgets/`, `shared/`)
- ✅ Configurar plugins, providers, middlewares
- ✅ Utilitários puros sem dependências de negócio

### `pages/` - Páginas/Rotas

**Responsabilidade**: Componentes de página que compõem as rotas.

**Estrutura:**
```
pages/
├── login/
│   ├── LoginView.vue
│   ├── RecoverPasswordView.vue
│   ├── 2FAView.vue
│   └── NewPasswordView.vue
├── users/
│   └── UsersView.vue
└── profile/
    └── ProfileView.vue
```

**Padrão de Nomenclatura:**
- `[Nome]View.vue` - PascalCase
- Exemplos: `LoginView.vue`, `UsersView.vue`, `ProfileView.vue`

**Responsabilidades:**
- ✅ Orquestrar features e widgets
- ✅ Gerenciar estado de página (não de negócio)
- ✅ Coordenar comunicação entre features
- ❌ NÃO conter lógica de negócio
- ❌ NÃO criar componentes reutilizáveis

**Exemplo:**
```vue
<script setup lang="ts">
import UserDialog from '@/features/users/handle-users/index.vue'
import UsersTable from '@/features/users/list-users/index.vue'
import { useListUsers } from '@/features/users/list-users/model/useListUsers'
import PageTitle from '@/widgets/page-title/index.vue'

const { getAllUsers } = useListUsers()
const { data, currentPage } = getAllUsers()

const userDialogRef = ref<InstanceType<typeof UserDialog> | null>(null)

const handleToggleDialog = () => {
  userDialogRef.value?.handleOpenDialog()
}
</script>

<template>
  <section>
    <PageTitle title="Usuários">
      <template #actions>
        <Button @click="handleToggleDialog">Novo usuário</Button>
      </template>
    </PageTitle>
    <UsersTable :data="data" :current-page="currentPage" />
    <UserDialog ref="userDialogRef" />
  </section>
</template>
```

### `features/` - Features de Negócio

**Responsabilidade**: Lógica de negócio específica, organizada por domínio.

**Estrutura:**
```
features/
└── [feature-name]/
    ├── index.vue              # Componente principal da feature
    ├── model/                  # Lógica de negócio
    │   ├── [feature]Schema.ts # Schema Zod de validação
    │   └── use[Feature].ts    # Composable com lógica
    ├── ui/                     # Componentes UI específicos
    │   └── [component]/
    │       ├── index.vue
    │       └── __tests__/
    └── store/                  # Stores Pinia (se necessário)
        └── [feature].ts
```

**Exemplos:**
- `auth/login-auth/` - Feature de login
- `auth/2fa-auth/` - Feature de autenticação 2FA
- `users/handle-users/` - Feature de gerenciamento de usuários
- `users/list-users/` - Feature de listagem de usuários
- `users/delete-users/` - Feature de exclusão de usuários
- `profile/update-profile/` - Feature de atualização de perfil

**Regras:**
- ✅ Uma feature = um domínio de negócio
- ✅ Features são auto-contidas e independentes
- ✅ Lógica sempre em `model/`
- ✅ UI específica em `ui/`
- ✅ Testes junto com o código em `__tests__/`
- ❌ Features NÃO podem importar de `pages/`
- ❌ Features NÃO podem importar de outras features diretamente
- ✅ Features podem usar `widgets/` e `shared/`

**Estrutura de Feature Completa:**

```typescript
// features/users/handle-users/model/postNewUserSchema.ts
import { z } from 'zod'

export const postNewUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
})

export type PostNewUserFormData = z.infer<typeof postNewUserSchema>
```

```typescript
// features/users/handle-users/model/useHandleUsers.ts
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { postNewUser as postNewUserService } from '@/shared/api/users-api/postNewUser'
import type { Payload } from '@/shared/api/users-api/types/postNewUser.types'

const postNewUser = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: Payload) =>
      postNewUserService(payload).catch((error) =>
        toast.error(error?.response?.data?.message || 'Erro desconhecido.'),
      ),
  })

  return { isPending, isError, error, isSuccess, mutate }
}

export function useHandleUsers() {
  return { postNewUser }
}
```

```vue
<!-- features/users/handle-users/index.vue -->
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { postNewUserSchema, type PostNewUserFormData } from './model/postNewUserSchema'
import { useHandleUsers } from './model/useHandleUsers'

const { postNewUser } = useHandleUsers()
const { mutate, isPending } = postNewUser()

const { handleSubmit } = useForm<PostNewUserFormData>({
  validationSchema: toTypedSchema(postNewUserSchema),
})

const onSubmit = handleSubmit((values) => {
  mutate(values)
})
</script>

<template>
  <Dialog>
    <form @submit="onSubmit">
      <!-- Form fields -->
    </form>
  </Dialog>
</template>
```

### `widgets/` - Componentes Compostos

**Responsabilidade**: Componentes reutilizáveis que combinam múltiplos elementos.

**Estrutura:**
```
widgets/
└── [widget-name]/
    ├── index.vue              # Componente principal
    └── ui/                    # Sub-componentes do widget
        └── [sub-component].vue
```

**Exemplos:**
- `header/` - Cabeçalho da aplicação
- `sidebar/` - Menu lateral
- `pagination/` - Componente de paginação
- `table-loader/` - Loader de tabela
- `page-title/` - Título de página com ações

**Regras:**
- ✅ Widgets são reutilizáveis em múltiplas features/pages
- ✅ Widgets podem combinar múltiplos elementos
- ✅ Widgets podem ter sub-componentes em `ui/`
- ❌ Widgets NÃO podem importar de `features/` ou `pages/`
- ✅ Widgets podem usar `shared/`

**Exemplo:**
```vue
<!-- widgets/page-title/index.vue -->
<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="flex items-center justify-between">
    <h1>{{ title }}</h1>
    <slot name="actions" />
  </div>
</template>
```

### `shared/` - Código Compartilhado

**Responsabilidade**: Código compartilhado entre múltiplas camadas.

**Estrutura:**
```
shared/
├── api/                       # Chamadas de API organizadas por domínio
│   ├── auth-api/
│   │   ├── postLogin.ts
│   │   ├── postTwoFactor.ts
│   │   └── types/
│   ├── users-api/
│   │   ├── getAllUsers.ts
│   │   ├── postNewUser.ts
│   │   └── types/
│   ├── profile-api/
│   │   └── types/
│   └── config/
│       ├── http-client.ts
│       └── interceptors/
├── components/                # Primitivos UI (Button, Input, etc.) - shadcn-vue
├── ui/                        # Assets, layouts base, ícones e loaders
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── icons/                 # Ícones SVG da aplicação
│   ├── layouts/
│   │   ├── Auth.vue
│   │   └── Default.vue
│   └── page-loader/           # Loader full-screen genérico
├── store/                     # Stores globais
│   └── theme.ts
└── mocks/                     # Handlers MSW
    ├── browser.ts
    └── handlers.ts
```

**Regras:**
- ✅ Shared não depende de nenhuma outra camada
- ✅ Código puro e reutilizável
- ✅ APIs organizadas por domínio
- ✅ Componentes UI genéricos
- ✅ Utilitários e helpers

### Shared: ui vs components

| Pasta | Uso | Exemplos |
|-------|-----|----------|
| `shared/components/` | Primitivos UI reutilizáveis (shadcn-vue) | Button, Input, Skeleton, Dialog, Table |
| `shared/ui/` | Assets, layouts base, ícones | tailwind.css, AppLogo.vue, Auth.vue, Default.vue |

### Convenção: sidebar (shared vs widgets)

Existem dois componentes com nome similar — não confundir:

| Import | Descrição |
|--------|-----------|
| `@/shared/components/collapsible-sidebar` | Componente shadcn de painel colapsável (Collapsible) |
| `@/widgets/sidebar` | Menu de navegação lateral da aplicação |

### Checklist: Onde colocar meu componente?

- □ É primitivo (Button, Input, Skeleton)? → `shared/components/`
- □ É asset, ícone ou layout base? → `shared/ui/`
- □ Combina vários shared e tem lógica de UI? → `widgets/`
- □ Tem regra de negócio? → `features/`

## Regras de Dependência

### Matriz de Dependências Permitidas

| De → Para | app/ | pages/ | features/ | widgets/ | shared/ |
|-----------|------|--------|-----------|----------|---------|
| `app/`    | ✅   | ❌     | ❌        | ❌       | ❌      |
| `pages/`  | ✅   | ✅     | ✅        | ✅       | ✅      |
| `features/` | ❌   | ❌     | ✅        | ✅       | ✅      |
| `widgets/` | ❌   | ❌     | ❌        | ✅       | ✅      |
| `shared/` | ❌   | ❌     | ❌        | ❌       | ✅      |

### Violações Comuns

**❌ ERRADO:**
```typescript
// features/users/handle-users/model/useHandleUsers.ts
import { UsersView } from '@/pages/users/UsersView.vue' // ❌ Feature importando Page
```

**❌ ERRADO:**
```typescript
// widgets/sidebar/index.vue
import { useLogin } from '@/features/auth/login-auth/model/useLogin' // ❌ Widget importando Feature
```

**❌ ERRADO:**
```typescript
// shared/api/auth-api/postLogin.ts
import { useAuthStore } from '@/features/auth/store/auth' // ❌ Shared importando Feature
```

**✅ CORRETO:**
```typescript
// pages/users/UsersView.vue
import UserDialog from '@/features/users/handle-users/index.vue' // ✅ Page importando Feature
import PageTitle from '@/widgets/page-title/index.vue' // ✅ Page importando Widget
```

## Organização de Features

### Quando Criar uma Nova Feature?

Crie uma nova feature quando:
- ✅ Representa um domínio de negócio distinto
- ✅ Tem lógica de negócio específica
- ✅ Pode ser reutilizada em múltiplas páginas
- ✅ Precisa de estado próprio

### Quando NÃO Criar uma Feature?

NÃO crie uma feature para:
- ❌ Componentes UI genéricos (use `widgets/` ou `shared/ui/`)
- ❌ Utilitários puros (use `shared/` ou `app/utils/`)
- ❌ Lógica específica de uma única página (coloque em `pages/`)

## Escalabilidade

### Crescimento Vertical (Features)

À medida que features crescem:
- Divida em sub-features se necessário
- Mantenha `model/` organizado por responsabilidade
- Use `ui/` para componentes específicos da feature

### Crescimento Horizontal (Camadas)

À medida que o projeto cresce:
- Adicione novas features sem afetar existentes
- Mantenha widgets genéricos e reutilizáveis
- Centralize código comum em `shared/`

## Migração e Refatoração

### Movendo Código Entre Camadas

**De `pages/` para `features/`:**
- Quando lógica de negócio é identificada
- Quando componente pode ser reutilizado

**De `features/` para `widgets/`:**
- Quando componente não tem lógica de negócio específica
- Quando pode ser usado por múltiplas features

**De qualquer lugar para `shared/`:**
- Quando código é puro e genérico
- Quando usado por múltiplas camadas
