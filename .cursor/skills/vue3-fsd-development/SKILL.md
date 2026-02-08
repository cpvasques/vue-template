---
name: vue3-fsd-development
description: Desenvolve aplicações Vue 3 seguindo arquitetura Feature-Sliced Design (FSD), implementando lazy loading, code splitting, e padrões de performance. Use quando desenvolvendo features, componentes, ou trabalhando com Vue 3 neste projeto.
---

# Vue 3 FSD Development

Guidelines para desenvolvimento Vue 3 seguindo arquitetura Feature-Sliced Design (FSD) adaptada.

## Princípios Fundamentais

1. **Separação de Responsabilidades**: Cada camada tem responsabilidade única e bem definida
2. **Isolamento de Features**: Features são auto-contidas e independentes
3. **Reutilização Inteligente**: Widgets e shared para código reutilizável
4. **Performance First**: Lazy loading e code splitting por padrão
5. **Type Safety**: TypeScript em todos os arquivos

## Arquitetura FSD

Estrutura de camadas (ordem de dependência):

```
app/ → pages/ → features/ → widgets/ → shared/
```

**Regras de dependência:**
- `app/` não depende de nenhuma camada
- `pages/` pode importar de `features/`, `widgets/`, `shared/`
- `features/` pode importar de `widgets/`, `shared/`
- `widgets/` pode importar de `shared/`
- `shared/` não depende de outras camadas

**NUNCA:**
- ❌ Features importando de `pages/`
- ❌ Widgets importando de `features/` ou `pages/`
- ❌ Shared importando de qualquer outra camada

Para detalhes completos, veja [architecture.md](architecture.md).

## Estrutura de Features

Cada feature segue esta estrutura:

```
features/[feature-name]/
├── index.vue              # Componente principal
├── model/                 # Lógica de negócio
│   ├── [feature]Schema.ts # Schema Zod
│   └── use[Feature].ts    # Composable
├── ui/                    # Componentes UI específicos
│   └── [component]/
│       ├── index.vue
│       └── __tests__/
└── store/                 # Store Pinia (se necessário)
```

**Diretrizes:**
- Uma feature = um domínio de negócio
- Lógica sempre em `model/`
- UI específica em `ui/`
- Testes junto ao código em `__tests__/`

## Lazy Loading Obrigatório

**Rotas**: Sempre usar dynamic imports:

```typescript
component: () => import('@/pages/users/UsersView.vue')
```

**Features pesadas**: Lazy load quando possível:

```vue
<script setup>
const HeavyComponent = defineAsyncComponent(() => 
  import('@/features/heavy-feature/index.vue')
)
</script>
```

**Mocks condicionais**: Lazy load de MSW:

```typescript
if (import.meta.env.VITE_ENABLE_MOCK_SERVER === 'true') {
  const { worker } = await import('../shared/mocks/browser.ts')
  worker.start()
}
```

Para otimizações avançadas, veja [performance.md](performance.md).

## Padrões de Código

### Composables com Vue Query

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

### APIs

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

### Validação Zod

```typescript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

Para mais padrões, veja [patterns.md](patterns.md).

## Boas Práticas

### ✅ FAZER

- Usar Composition API com `<script setup>`
- Tipar tudo com TypeScript
- Separar tipos em arquivos `types/`
- Usar `cn()` para merge de classes Tailwind
- Implementar error handling em composables
- Usar Vue Query para estado servidor
- Usar Pinia apenas para estado cliente global
- Testar features junto com o código

### ❌ NÃO FAZER

- Misturar lógica de negócio com UI
- Criar dependências circulares entre camadas
- Importar features em widgets
- Usar `any` em TypeScript
- Hardcode de valores (usar env vars)
- Lógica complexa em templates
- Mutar props diretamente
- Criar stores Pinia para estado local

Para lista completa, veja [best-practices.md](best-practices.md).

## Performance

### Code Splitting

- Rotas sempre lazy loaded
- Features pesadas com `defineAsyncComponent`
- Bibliotecas grandes importadas dinamicamente

### Vue Query

- Configurar `staleTime` e `gcTime` apropriadamente
- Usar `queryKey` reativo para invalidação automática
- Implementar paginação com `currentPage` e `perPage`

### Renderização

- Usar `v-show` para toggle frequente
- Usar `v-if` para renderização condicional pesada
- Evitar watchers desnecessários
- Usar `computed` para valores derivados

Para otimizações avançadas, veja [performance.md](performance.md).

## Nomenclatura

- **Componentes**: PascalCase (`LoginView.vue`, `UserDialog.vue`)
- **Composables**: camelCase com `use` (`useLogin.ts`, `useListUsers.ts`)
- **Stores**: camelCase com `use` (`useAuthStore`)
- **APIs**: camelCase com verbo (`postLogin.ts`, `getAllUsers.ts`)
- **Features**: kebab-case (`login-auth/`, `handle-users/`)
- **Tipos**: PascalCase (`Payload`, `Response`, `User`)

## Imports

- Sempre usar alias `@/` para `src/`
- Ordenação automática via ESLint `simple-import-sort`
- Agrupar: externos → internos → tipos

```typescript
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

import { postLogin as postLoginService } from '@/shared/api/auth-api/postLogin'
import type { Payload } from '@/shared/api/auth-api/types/postLogin.types'
```

## Recursos Adicionais

- [architecture.md](architecture.md) - Detalhes sobre FSD e estrutura
- [best-practices.md](best-practices.md) - Boas práticas e anti-patterns
- [performance.md](performance.md) - Lazy loading e otimizações
- [patterns.md](patterns.md) - Padrões de código específicos
