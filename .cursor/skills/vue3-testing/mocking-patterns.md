# Padrões de Mocking

Guidelines para mocking de dependências em testes unitários e E2E.

## MSW (Mock Service Worker)

### Setup Básico

MSW está configurado em `src/shared/mocks/`:

```typescript
// src/shared/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

### Handlers

Handlers organizados por domínio em `src/shared/mocks/handlers.ts`:

```typescript
// src/shared/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('http://localhost:8080/auth/login', () => {
    return HttpResponse.json({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),
]
```

## Mocking em Testes Unitários

### Mocking de Vue Router

```typescript
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
    })),
    useRoute: vi.fn(() => ({
      params: {},
      query: {},
      path: '/',
    })),
  }
})
```

### Mocking de Componentes UI (shadcn-vue / Reka UI)

Os componentes UI estão em `@/shared/components/`. Para mockar em testes:

**Opção 1 - Stubs no mount:**
```typescript
const wrapper = mount(Component, {
  global: {
    stubs: {
      Button: { template: '<button><slot /></button>' },
      Input: { template: '<input />' },
    },
  },
})
```

**Opção 2 - Mock do módulo:**
```typescript
vi.mock('@/shared/components/button', () => ({
  Button: {
    template: '<button><slot /></button>',
    props: ['variant', 'size'],
  },
}))

vi.mock('@/shared/components/form', () => ({
  FormField: {
    template: '<div><slot v-bind="{ componentField: {}, errors: [] }" /></div>',
  },
  FormItem: { template: '<div><slot /></div>' },
  FormLabel: { template: '<label><slot /></label>' },
  FormMessage: { template: '<div><slot /></div>' },
  FormControl: { template: '<div><slot /></div>' },
}))

vi.mock('@/shared/components/input', () => ({
  Input: { template: '<input />' },
}))

vi.mock('@/shared/components/input-password', () => ({
  InputPassword: { template: '<input type="password" />' },
}))
```

### Mocking de Vue Sonner (Toast)

```typescript
vi.mock('vue-sonner', () => {
  return {
    toast: {
      error: vi.fn(),
      success: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    },
  }
})
```

### Mocking de Composables

```typescript
vi.mock('@/features/feature/model/useFeature', () => ({
  useFeature: vi.fn().mockReturnValue({
    action: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isPending: ref(false),
      isError: ref(false),
      isSuccess: ref(false),
      error: ref(null),
    }),
    getData: vi.fn().mockReturnValue({
      data: ref(null),
      isLoading: ref(false),
      refetch: vi.fn(),
    }),
  }),
}))
```

### Mocking de APIs

```typescript
vi.mock('@/shared/api/feature-api/action', () => ({
  actionService: vi.fn().mockResolvedValue({
    id: 1,
    name: 'Mocked Data',
  }),
}))
```

### Mocking de Vue Query

```typescript
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
  })),
}))
```

## Mocking em Testes E2E

### Interceptar Requisições HTTP

```typescript
// Mockar sucesso
await page.route('**/api/users', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ]),
  })
})

// Mockar erro
await page.route('**/api/users', async (route) => {
  await route.fulfill({
    status: 500,
    contentType: 'application/json',
    body: JSON.stringify({
      message: 'Internal Server Error',
    }),
  })
})

// Mockar com delay (simular loading)
await page.route('**/api/users', async (route) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([]),
  })
})
```

### Mockar Respostas Dinâmicas

```typescript
await page.route('**/api/users/*', async (route) => {
  const url = new URL(route.request().url())
  const userId = url.pathname.split('/').pop()
  
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      id: userId,
      name: `User ${userId}`,
    }),
  })
})
```

## Padrões de Reutilização

### Criar Helpers de Mock

```typescript
// __tests__/helpers/mocks.ts
export const createRouterMock = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
})

export const createUseFeatureMock = (overrides = {}) => ({
  action: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: ref(false),
    ...overrides,
  }),
})
```

### Setup Global de Mocks

```typescript
// __tests__/setup.ts
import { vi } from 'vitest'

// Configurar mocks globais antes de todos os testes
beforeAll(() => {
  vi.mock('vue-router', () => ({
    useRouter: () => createRouterMock(),
    useRoute: () => ({ params: {}, query: {} }),
  }))
})
```

## Simulação de Estados

### Loading States

```typescript
// Mock com loading
vi.mocked(useFeature).mockReturnValue({
  action: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: ref(true), // Loading
  }),
})

// Mock sem loading
vi.mocked(useFeature).mockReturnValue({
  action: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: ref(false), // Não está carregando
  }),
})
```

### Error States

```typescript
// Mock com erro
vi.mocked(useFeature).mockReturnValue({
  action: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: ref(false),
    isError: ref(true),
    error: ref({ message: 'Erro ao processar' }),
  }),
})
```

### Success States

```typescript
// Mock com sucesso
vi.mocked(useFeature).mockReturnValue({
  action: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: ref(false),
    isSuccess: ref(true),
  }),
})
```

## Boas Práticas

### ✅ FAZER

- Mockar dependências externas (APIs, bibliotecas)
- Usar `vi.clearAllMocks()` no `beforeEach`
- Criar mocks reutilizáveis quando possível
- Mockar comportamento, não implementação
- Usar tipos corretos nos mocks

### ❌ NÃO FAZER

- Não mockar código que você está testando
- Não criar mocks muito complexos
- Não esquecer de limpar mocks entre testes
- Não mockar bibliotecas de terceiros desnecessariamente
- Não criar mocks que não refletem comportamento real

## Exemplo Completo

```typescript
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'vue-sonner'

import { useLogin } from '@/features/auth/login-auth/model/useLogin'
import LoginForm from '../index.vue'

// Mocks
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: vi.fn(() => ({ push: vi.fn() })),
  }
})

vi.mock('@/shared/components/button', () => ({
  Button: { template: '<button><slot /></button>' },
}))
vi.mock('@/shared/components/input', () => ({
  Input: { template: '<input />' },
}))
// Stub outros componentes conforme necessário

vi.mock('vue-sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

vi.mock('@/features/auth/login-auth/model/useLogin', () => ({
  useLogin: vi.fn().mockReturnValue({
    postLogin: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isPending: ref(false),
    }),
  }),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks() // Limpar mocks entre testes
  })

  it('deve renderizar corretamente', () => {
    const wrapper = mount(LoginForm)
    expect(wrapper.exists()).toBe(true)
  })
})
```

## Recursos Adicionais

- [MSW Docs](https://mswjs.io/docs/)
- [Vitest Mocking](https://vitest.dev/guide/mocking.html)
- [Playwright Network](https://playwright.dev/docs/network)
