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
- **@phosphor-icons/vue** - Biblioteca de ícones alternativa
- **Vue Sonner** - Notificações toast
- **class-variance-authority** - Variantes de componentes
- **tw-animate-css + tailwind-animate** - Animações CSS

### Validação & Formulários
- **VeeValidate 4.15.1** - Validação de formulários
- **Zod 3.25.76** - Schema validation
- **@vee-validate/zod** - Integração VeeValidate + Zod
- **zod-i18n-map** - Mensagens de erro internacionalizadas

### Data Fetching
- **@tanstack/vue-query 5.92.1** - Gerenciamento de estado servidor
- **@tanstack/vue-table 8.21.3** - Tabelas com sorting/filtering
- **Axios 1.13.2** - Cliente HTTP (padrão)
- **Fetch API** - Cliente HTTP alternativo (adapter disponível)

### Utilitários
- **@vueuse/core** - Composables utilitários Vue
- **date-fns** - Manipulação de datas
- **date-fns-tz** - Timezone para date-fns
- **lodash** - Utilitários JavaScript
- **maska** - Máscaras de input
- **clsx + tailwind-merge** - Merge de classes CSS

### Dev Tools
- **vite-plugin-vue-devtools** - DevTools Vue no navegador
- **@tanstack/vue-query-devtools** - DevTools Vue Query

### Testes
- **Vitest 4.0.16** - Testes unitários
- **Playwright 1.57.0** - Testes E2E
- **MSW 2.12.4** - Mock Service Worker para mocks de API

## 🏗 Arquitetura do Projeto

O projeto segue uma arquitetura baseada em **Feature-Sliced Design (FSD)** com as seguintes camadas:

```
src/
├── app/              # Configuração e inicialização da aplicação
├── lib/              # Utilitários compartilhados (cn, etc.)
├── pages/            # Páginas/rotas da aplicação
├── features/         # Features de negócio (lógica específica)
├── widgets/          # Componentes compostos reutilizáveis
└── shared/           # Código compartilhado (UI, API, utils)
```

### Estrutura Detalhada

#### `app/` - Core da Aplicação
- **`main.ts`** - Ponto de entrada, inicialização de plugins
- **`providers/router/`** - Configuração de rotas
- **`middlewares/`** - Middlewares de roteamento (requireAuth, keepConnected)
- **`plugins/`** - Plugins Vue (Pinia, VueQuery, i18n-zod, Maska)
- **`api/`** - Adaptadores HTTP (axios-adapter, fetch-adapter, types)
- **`utils/`** - Utilitários globais (cn, decodeJwt, passwordRegex, getParentBackgroundColor)

#### `lib/` - Utilitários compartilhados
- **`utils.ts`** - Função `cn()` para merge de classes (padrão shadcn-vue)
- Usado por `shared/components/`; `app/utils/cn.ts` ainda existe e é usado por alguns widgets

#### `pages/` - Páginas/Rotas
Componentes de página que compõem as rotas. Importam features e widgets. Organizados em subpastas por domínio.

**Estrutura:**
```
pages/
├── login/            # LoginView, RecoverPasswordView, 2FAView, NewPasswordView
├── users/            # UsersView
└── profile/          # ProfileView
```

**Padrão:**
- Cada página corresponde a uma rota
- Nomenclatura: `[Nome]View.vue`

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
- `auth/2fa-auth/` - Autenticação 2FA
- `auth/recover-password-auth/` - Recuperação de senha
- `auth/new-password-auth/` - Nova senha
- `users/handle-users/` - Feature de criar/editar usuários
- `users/list-users/` - Feature de listagem de usuários
- `users/delete-users/` - Feature de exclusão de usuários
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

#### `shared/` - Código Compartilhado
- **`api/`** - Chamadas de API organizadas por domínio
  - `auth-api/` - postLogin, postTwoFactor, postRecover, postNewPassword, postResendCode
  - `users-api/` - getAllUsers, getUserById, postNewUser, updateUser, deleteUser
  - `profile-api/` - postNewPhoto
  - `config/` - http-client.ts, interceptors (handleBearer, handleUnauthorized)
- **`components/`** - Primitivos UI (shadcn-vue) - ~50 componentes
  - accordion, alert, alert-dialog, autocomplete, avatar, badge, breadcrumb, button, calendar, card, carousel, checkbox, collapsible, collapsible-sidebar, command, context-menu, data-table, date-picker, dialog, drawer, dropdown-menu, events-calendar, file-input, form, hover-card, input, input-file, input-password, label, menubar, month-picker, multi-select, navigation-menu, number-field, pagination, pin-input, popover, progress, radio-group, range-calendar, range-date-picker, resizable, scroll-area, select, separator, sheet, skeleton, slider, sonner, stepper, switch, table, table-loader, tabs, tags-input, textarea, theme-toggle, toast, toggle, toggle-group, tooltip
- **`ui/`** - Assets, layouts base, ícones e loaders
  - `assets/` - images, styles/tailwind.css
  - `icons/` - AppLogo.vue
  - `layouts/` - Auth.vue, Default.vue
  - `page-loader/` - Loader full-screen genérico
- **`store/`** - Stores globais (theme.ts)
- **`mocks/`** - Handlers MSW (browser.ts, handlers.ts)

**Convenção shared/ui vs shared/components:**
| Pasta | Uso | Exemplos |
|-------|-----|----------|
| `shared/components/` | Primitivos UI reutilizáveis (shadcn-vue) | Button, Input, Dialog, Table, Skeleton |
| `shared/ui/` | Assets, layouts base, ícones | tailwind.css, AppLogo.vue, Auth.vue, Default.vue |

**Convenção sidebar (não confundir):**
| Import | Descrição |
|--------|-----------|
| `@/shared/components/collapsible-sidebar` | Componente shadcn de painel colapsável |
| `@/widgets/sidebar` | Menu de navegação lateral da aplicação |

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

**HTTP Client:** `shared/api/config/http-client.ts` exporta `axiosClient` (padrão) e `fetchClient`. Ambos implementam a interface `HttpClient` dos adapters em `app/api/`.

**Padrão com axiosClient:**
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

**Adaptadores:** `app/api/axios-adapter.ts` e `app/api/fetch-adapter.ts` implementam a mesma interface, permitindo trocar o cliente HTTP sem alterar as chamadas de API.

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

**Estrutura de rotas:** `app/providers/router/index.ts`

```typescript
// Rotas protegidas (DefaultTemplate + requireAuth)
{ path: '/users', name: 'Users', meta: { render: true, menuLabel: 'Users' } }
{ path: '/profile', name: 'Profile', meta: { render: false, menuLabel: 'Profile' } }

// Rotas de auth (AuthTemplate)
{ path: '/auth/login', name: 'Login', beforeEnter: keepConnected }
{ path: '/auth/recover-password', name: 'RecoverPassword' }
{ path: '/auth/two-factor-auth', name: 'TwoFactorAuth' }
{ path: '/auth/new-password', name: 'NewPassword' }
```

**Meta propriedades:**
- `render: boolean` - Se deve aparecer no menu lateral
- `menuLabel: string` - Label no menu

## 🎨 Estilização

### Tailwind CSS
- Configuração em `tailwind.config.ts`
- Estilos globais em `shared/ui/assets/styles/tailwind.css`
- Uso de utility classes
- Suporte a dark mode via classes `dark:`

### Utilitário `cn()`
Função helper para merge de classes (clsx + tailwind-merge). Dois locais:
- **`@/lib/utils`** - Padrão shadcn-vue, usado por `shared/components/`
- **`@/app/utils/cn`** - Usado por alguns widgets (sidebar, pagination)

```typescript
import { cn } from '@/lib/utils'

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

2. **Middlewares:**
   - `requireAuth` e `keepConnected` protegem rotas
   - Verificar se lógica está ativa em `app/middlewares/`

3. **Componentes UI:**
   - shadcn-vue: https://www.shadcn-vue.com/docs/components
   - Reka UI: https://reka-ui.com/
   - Componentes em `src/shared/components/`

4. **Mock Server:**
   - MSW ativado via `VITE_ENABLE_MOCK_SERVER=true`
   - Inicialização em `main.ts` importa `shared/mocks/browser.ts`
   - Gerar worker: `npx msw init public`

5. **Utilitário cn():**
   - Preferir `@/lib/utils` (padrão shadcn) para novos componentes em shared
   - `@/app/utils/cn` ainda usado por widgets legados

## 📁 Documentação Cursor (.cursor/)

O projeto inclui regras e skills para assistentes:

- **`.cursor/rules/`** - architecture-core-principles, api-development, error-handling, typescript-patterns, complexity-analysis
- **`.cursor/skills/`** - vue3-fsd-development, vue3-forms-validation, vue3-testing, component-composition, ui-components, tailwind-patterns

Consultar `architecture-core-principles.md` e `vue3-fsd-development/architecture.md` para decisões arquiteturais detalhadas.

## 📚 Documentações de Referência

- [Vue.js](https://vuejs.org/guide/introduction)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [TanStack Query Vue](https://tanstack.com/query/v5/docs/framework/vue/overview)
- [Tailwind CSS](https://v3.tailwindcss.com/)
- [VeeValidate](https://vee-validate.logaretm.com/v4/)
- [Reka UI](https://reka-ui.com/) - Componentes UI (se aplicável)
