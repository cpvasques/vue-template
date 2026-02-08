# AGENTS.md - Vue Template

Documentação otimizada para LLMs sobre a arquitetura, padrões e convenções deste projeto Vue.js.

## 📋 Visão Geral

Este é um template Vue.js 3 utilizando TypeScript, seguindo a arquitetura **Feature-Sliced Design (FSD)** adaptada. O projeto implementa uma aplicação SPA com autenticação, gerenciamento de usuários e perfil.

## 🛠 Stack Tecnológico

### Core
- **Vue.js 3.5.25** - Framework principal (Composition API)
- **TypeScript 5.9.3** - Tipagem estática
- **Vite 7.3.0** - Build tool e dev server
- **Vue Router 4.6.4** - Roteamento
- **Pinia 3.0.4** - Gerenciamento de estado (com persistência)

### UI & Estilização
- **Tailwind CSS 4.1.18** - Framework CSS utility-first
- **shadcn-vue** - Componentes UI estilizados (em `src/shared/components/`)
- **Reka UI** - Componentes primitivos base (acessibilidade)
- **Lucide Vue Next** - Biblioteca de ícones
- **Vue Sonner** - Notificações toast

### Validação & Formulários
- **VeeValidate 4.15.1** - Validação de formulários
- **Zod 3.25.76** - Schema validation
- **@vee-validate/zod** - Integração VeeValidate + Zod
- **zod-i18n-map** - Mensagens de erro internacionalizadas

### Data Fetching
- **@tanstack/vue-query 5.92.1** - Gerenciamento de estado servidor
- **Axios 1.13.2** - Cliente HTTP (padrão)
- **Fetch API** - Cliente HTTP alternativo (adapter disponível)

### Utilitários
- **@vueuse/core** - Composables utilitários Vue
- **date-fns** - Manipulação de datas
- **lodash** - Utilitários JavaScript
- **maska** - Máscaras de input
- **clsx + tailwind-merge** - Merge de classes CSS

### Testes
- **Vitest** - Testes unitários
- **Playwright** - Testes E2E
- **MSW 2.12.4** - Mock Service Worker para mocks de API

## 🏗 Arquitetura do Projeto

O projeto segue uma arquitetura baseada em **Feature-Sliced Design (FSD)** com as seguintes camadas:

```
src/
├── app/              # Configuração e inicialização da aplicação
├── pages/            # Páginas/rotas da aplicação
├── features/         # Features de negócio (lógica específica)
├── widgets/          # Componentes compostos reutilizáveis
└── shared/           # Código compartilhado (UI, API, utils)
```

### Estrutura Detalhada

#### `app/` - Core da Aplicação
- **`main.ts`** - Ponto de entrada, inicialização de plugins
- **`providers/`** - Providers (router, etc)
- **`middlewares/`** - Middlewares de roteamento
- **`plugins/`** - Plugins Vue (Pinia, VueQuery, i18n, Maska)
- **`api/`** - Adaptadores HTTP (axios-adapter, fetch-adapter)
- **`utils/`** - Utilitários globais

#### `pages/` - Páginas/Rotas
Componentes de página que compõem as rotas. Importam features e widgets.

**Padrão:**
- Cada página corresponde a uma rota
- Nomenclatura: `[Nome]View.vue`
- Exemplos: `LoginView.vue`, `UsersView.vue`, `ProfileView.vue`

#### `features/` - Features de Negócio
Lógica de negócio específica, organizada por domínio.

**Estrutura típica:**
```
features/
└── [feature-name]/
    ├── index.vue              # Componente principal da feature
    ├── model/                  # Lógica de negócio
    │   ├── [feature]Schema.ts  # Schema Zod de validação
    │   └── use[Feature].ts     # Composable com lógica
    ├── ui/                     # Componentes UI específicos
    │   └── [component]/
    │       ├── index.vue
    │       └── __tests__/
    └── store/                  # Stores Pinia (se necessário)
```

**Exemplos:**
- `auth/login-auth/` - Feature de login
- `users/handle-users/` - Feature de gerenciamento de usuários
- `profile/update-profile/` - Feature de atualização de perfil

#### `widgets/` - Componentes Compostos
Componentes reutilizáveis que combinam múltiplos elementos.

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
- `page-title/` - Título de página com ações

**Loader full-screen:** `shared/ui/page-loader/` (componente genérico)

#### `shared/` - Código Compartilhado
- **`api/`** - Chamadas de API organizadas por domínio
  - `auth-api/` - APIs de autenticação
  - `users-api/` - APIs de usuários
  - `profile-api/` - APIs de perfil
  - `config/` - Configuração HTTP (client, interceptors)
- **`ui/`** - Componentes UI reutilizáveis
  - `layouts/` - Layouts (Auth.vue, Default.vue)
  - `assets/` - Assets (imagens, estilos)
- **`store/`** - Stores globais (theme, etc)
- **`mocks/`** - Handlers MSW para mock de API

## 🔄 Fluxos Principais

### Autenticação

1. **Login** (`/auth/login`)
   - Feature: `features/auth/login-auth/`
   - API: `shared/api/auth-api/postLogin.ts`
   - Store: `features/auth/store/auth.ts`
   - Middleware: `app/middlewares/keepConnected.ts` (redireciona se já logado)

2. **2FA** (`/auth/two-factor-auth`)
   - Feature: `features/auth/2fa-auth/`
   - Valida código de dois fatores

3. **Recuperação de Senha** (`/auth/recover-password`)
   - Feature: `features/auth/recover-password-auth/`

4. **Nova Senha** (`/auth/new-password`)
   - Feature: `features/auth/new-password-auth/`

### Rotas Protegidas

- Middleware: `app/middlewares/requireAuth.ts`
- Verifica token em `localStorage` ou `sessionStorage`
- Redireciona para `/auth/login` se não autenticado

### Interceptors HTTP

**Bearer Token** (`shared/api/config/interceptors/handleBearer.ts`)
- Adiciona automaticamente `Authorization: Bearer {token}` nas requisições
- Busca token de `localStorage.getItem('token')` ou `sessionStorage.getItem('token')`

**Unauthorized** (`shared/api/config/interceptors/handleUnauthorized.ts`)
- Intercepta respostas 401/403
- Remove tokens do storage
- Exibe toast de erro
- Redireciona para login (comentado atualmente)

## 📝 Padrões de Código

### Composables

**Padrão de composable com Vue Query:**
```typescript
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { postLogin as postLoginService } from '@/shared/api/auth-api/postLogin'
import type { Payload } from '@/shared/api/auth-api/types/postLogin.types'

const postLogin = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: Payload) =>
      postLoginService(payload).catch((error) =>
        toast.error(error?.response?.data?.message || 'Erro desconhecido.'),
      ),
  })

  return { isPending, isError, error, isSuccess, mutate }
}

export function useLogin() {
  return { postLogin }
}
```

### Chamadas de API

**Padrão com Axios:**
```typescript
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

**Tipos sempre em arquivo separado:**
```typescript
// types/postLogin.types.ts
export interface Payload {
  email: string
  password: string
}

export interface Response {
  token: string
  user: User
}
```

### Validação com Zod

**Padrão de schema:**
```typescript
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import i18next from 'i18next'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

### Stores Pinia

**Padrão com persistência:**
```typescript
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    profile: { name: '', email: '' },
    token: '',
  }),
  getters: {
    username: (state) => state.profile.name,
  },
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('accessToken', token)
    },
  },
  persist: {
    storage: sessionStorage, // ou localStorage
  },
})
```

### Rotas

**Estrutura de rotas:**
```typescript
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultTemplate,
    beforeEnter: requireAuth,
    children: [
      {
        path: '/users',
        name: 'Users',
        meta: { render: true, menuLabel: 'Users' },
        component: () => import('@/pages/users/UsersView.vue'),
      },
    ],
  },
]
```

**Meta propriedades:**
- `render: boolean` - Se deve aparecer no menu
- `menuLabel: string` - Label no menu

## 🎨 Estilização

### Tailwind CSS
- Configuração em `tailwind.config.ts`
- Estilos globais em `shared/ui/assets/styles/tailwind.css`
- Uso de utility classes
- Suporte a dark mode via classes `dark:`

### Utilitário `cn()`
Função helper para merge de classes:
```typescript
import { cn } from '@/app/utils/cn'

const classes = cn('base-class', condition && 'conditional-class')
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente
- `VITE_APP_BASE_URL` - URL base da API
- `VITE_ENABLE_MOCK_SERVER` - Ativa MSW para mocks

### Auto-imports
Configurado via `unplugin-auto-import`:
- `vue` (ref, computed, watch, etc)
- `@vueuse/core`
- `vee-validate`
- `vue-router`

### Componentes Auto-importados
Configurado via `unplugin-vue-components`:
- Componentes Vue são auto-importados
- Tipos gerados em `components.d.ts`

## 🧪 Testes

### Unitários (Vitest)
- Arquivos em `__tests__/` dentro das features
- Configuração em `vitest.config.ts`
- MSW disponível para mock de APIs

### E2E (Playwright)
- Testes em `playwright/`
- Configuração em `playwright.config.ts`
- Organizados por feature/flow

## 📦 Gerenciamento de Dependências

### Scripts NPM
- `npm run dev` - Inicia servidor de desenvolvimento (porta 8080)
- `npm run build` - Build de produção
- `npm run test:unit` - Roda testes unitários
- `npm run lint:check` - Verifica lint
- `npm run lint:fix` - Corrige problemas de lint
- `npm run format` - Formata código com Prettier
- `npm run type-check` - Verifica tipos TypeScript

### Pre-commit Hooks
Husky configurado para:
- Formatação automática
- Verificação de lint

## 🔐 Segurança

### Tokens
- Armazenados em `localStorage` ou `sessionStorage`
- Chave: `accessToken` ou `token` (inconsistência atual)
- Adicionados automaticamente via interceptor Bearer

### Middlewares de Rota
- `requireAuth` - Protege rotas autenticadas
- `keepConnected` - Redireciona se já logado (páginas de auth)

## 🚀 Convenções Importantes

1. **Nomenclatura:**
   - Componentes: PascalCase (`LoginView.vue`)
   - Composables: camelCase com prefixo `use` (`useLogin.ts`)
   - Stores: camelCase com prefixo `use` (`useAuthStore`)
   - APIs: camelCase com verbo (`postLogin.ts`, `getAllUsers.ts`)

2. **Imports:**
   - Sempre usar alias `@/` para imports de `src/`
   - Ordenação automática via ESLint plugin `simple-import-sort`

3. **TypeScript:**
   - Sempre tipar funções e interfaces
   - Tipos de API em arquivos separados `types/`
   - Usar `z.infer` para tipos derivados de Zod schemas

4. **Componentes:**
   - Usar Composition API com `<script setup>`
   - Expor métodos via `defineExpose` quando necessário
   - Props tipadas com `defineProps<Type>()`

5. **Features:**
   - Cada feature deve ser auto-contida
   - Lógica de negócio em `model/`
   - UI específica em `ui/`
   - Testes junto com o código

6. **API:**
   - Uma função por arquivo
   - Tipos sempre separados
   - Usar `axiosClient` ou `fetchClient` conforme necessário

## ⚠️ Observações Importantes

1. **Inconsistência de tokens:**
   - Store usa `accessToken`
   - Interceptors usam `token`
   - Verificar qual é o padrão correto

2. **Middlewares comentados:**
   - `requireAuth` e `keepConnected` têm lógica comentada
   - Autenticação está desabilitada para desenvolvimento

3. **Componentes UI:**
   - shadcn-vue: https://www.shadcn-vue.com/docs/components
   - Reka UI: https://reka-ui.com/
   - Componentes em `src/shared/components/`

4. **Mock Server:**
   - MSW configurado mas precisa gerar `mockServiceWorker.js`
   - Comando: `npx msw init public`

## 📚 Documentações de Referência

- [Vue.js](https://vuejs.org/guide/introduction)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [TanStack Query Vue](https://tanstack.com/query/v5/docs/framework/vue/overview)
- [Tailwind CSS](https://v3.tailwindcss.com/)
- [VeeValidate](https://vee-validate.logaretm.com/v4/)
- [Reka UI](https://reka-ui.com/) - Componentes UI (se aplicável)
