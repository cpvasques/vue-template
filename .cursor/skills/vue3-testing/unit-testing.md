# Testes Unitários com Vitest

Padrões e templates para testes unitários usando Vitest e Vue Test Utils.

## Setup Básico

### Configuração

O projeto usa Vitest com ambiente `jsdom` configurado em `vitest.config.ts`:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**', 'playwright/**'],
  },
})
```

### Imports Padrão

```typescript
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
```

## Estrutura de Testes

### Padrão Básico

```typescript
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Component from '../index.vue'

describe('Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar corretamente', () => {
    const wrapper = mount(Component)
    expect(wrapper.exists()).toBe(true)
  })
})
```

## Testando Componentes Vue

### Template Completo

Ver [templates.md](./templates.md) para template completo. Mocks em [mocking-patterns.md](./mocking-patterns.md).

```typescript
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Component from '../index.vue'

const RouterLinkStub = { name: 'RouterLink', template: '<a :href="to"><slot /></a>', props: ['to'] }

describe('Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar corretamente', () => {
    const wrapper = mount(Component, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Texto esperado')
  })

  it('deve executar ação ao submeter formulário', async () => {
    // Mock composable com vi.mocked(useFeature).mockReturnValue(...) - ver mocking-patterns.md
    const wrapper = mount(Component, { global: { stubs: { RouterLink: RouterLinkStub } } })
    await wrapper.find('form').trigger('submit')
    // expect(mutateMock).toHaveBeenCalled()
  })
})
```

### Mocking

**Referência completa:** [mocking-patterns.md](./mocking-patterns.md) — Design System, Vue Router, Composables, APIs, Vue Query.

## Testando Composables

### Template para Composable com Vue Query

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useQuery, useMutation } from '@tanstack/vue-query'

import { useFeature } from '../useFeature'

// Mock do Vue Query
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}))

// Mock do serviço de API
vi.mock('@/shared/api/feature-api/action', () => ({
  actionService: vi.fn(),
}))

describe('useFeature', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar dados quando query é bem-sucedida', () => {
    const mockData = { id: 1, name: 'Test' }
    
    vi.mocked(useQuery).mockReturnValue({
      data: ref(mockData),
      isLoading: ref(false),
      isFetching: ref(false),
      refetch: vi.fn(),
    } as any)

    const { data } = useFeature()
    
    expect(data.value).toEqual(mockData)
  })

  it('deve chamar mutate quando executar ação', () => {
    const mutateMock = vi.fn()
    
    vi.mocked(useMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: ref(false),
    } as any)

    const { action } = useFeature()
    action().mutate({ field: 'value' })
    
    expect(mutateMock).toHaveBeenCalledWith({ field: 'value' })
  })
})
```

## Testando Schemas Zod

### Template para Schema

```typescript
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { featureSchema } from '../featureSchema'

describe('featureSchema', () => {
  it('deve validar dados corretos', () => {
    const validData = {
      email: 'test@example.com',
      password: '123456',
    }

    const result = featureSchema.safeParse(validData)
    
    expect(result.success).toBe(true)
  })

  it('deve rejeitar email inválido', () => {
    const invalidData = {
      email: 'email-invalido',
      password: '123456',
    }

    const result = featureSchema.safeParse(invalidData)
    
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors[0].path).toContain('email')
    }
  })

  it('deve rejeitar senha muito curta', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '123',
    }

    const result = featureSchema.safeParse(invalidData)
    
    expect(result.success).toBe(false)
  })
})
```

## Padrões de Assertions

### Verificações Comuns

```typescript
// Existência
expect(wrapper.exists()).toBe(true)

// Texto
expect(wrapper.text()).toContain('Texto esperado')

// Classes CSS
expect(wrapper.classes()).toContain('classe-esperada')

// Props
expect(wrapper.props('propName')).toBe(expectedValue)

// Emits
expect(wrapper.emitted('eventName')).toBeTruthy()
expect(wrapper.emitted('eventName')[0]).toEqual([payload])

// Chamadas de função
expect(mockFunction).toHaveBeenCalled()
expect(mockFunction).toHaveBeenCalledWith(expectedArgs)
expect(mockFunction).toHaveBeenCalledTimes(2)
```

## Boas Práticas

### ✅ FAZER

- Usar `beforeEach` para limpar mocks
- Testar comportamento, não implementação
- Usar nomes descritivos em português
- Agrupar testes relacionados em `describe` blocks
- Mockar dependências externas
- Testar casos de sucesso e erro
- Limpar após cada teste

### ❌ NÃO FAZER

- Não testar detalhes de implementação interna
- Não criar mocks desnecessários
- Não esquecer de limpar mocks entre testes
- Não testar bibliotecas de terceiros
- Não criar testes frágeis que quebram com mudanças pequenas

## Exemplo Real do Projeto

Baseado em `src/features/auth/login-auth/__tests__/login.spec.ts`:

```typescript
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'vue-sonner'

import { useLogin } from '@/features/auth/login-auth/model/useLogin'
import LoginForm from '../index.vue'

// Mocks configurados...

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar corretamente', () => {
    const wrapper = mount(LoginForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  // Mais testes...
})
```

## Recursos Adicionais

- [Vue Test Utils Docs](https://test-utils.vuejs.org/)
- [Vitest Docs](https://vitest.dev/guide/)
- [Testing Vue Components](https://vuejs.org/guide/scaling-up/testing.html)
