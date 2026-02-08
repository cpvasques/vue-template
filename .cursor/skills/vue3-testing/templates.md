# Templates de Testes

Templates prontos para copiar e adaptar. **Mocks:** ver [mocking-patterns.md](./mocking-patterns.md).

## Template: Teste de Componente Vue

```typescript
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeature } from '@/features/feature/model/useFeature'
import Component from '../index.vue'

// Mocks: vue-router, componentes UI (@/shared/components/*), vue-sonner - ver mocking-patterns.md

const RouterLinkStub = { name: 'RouterLink', template: '<a :href="to"><slot /></a>', props: ['to'] }

describe('Component', () => {
  beforeEach(() => vi.clearAllMocks())

  it('deve renderizar corretamente', () => {
    const wrapper = mount(Component, { global: { stubs: { RouterLink: RouterLinkStub } } })
    expect(wrapper.exists()).toBe(true)
  })

  it('deve executar ação ao submeter', async () => {
    const mutateMock = vi.fn()
    vi.mocked(useFeature).mockReturnValue({
      action: vi.fn().mockReturnValue({ mutate: mutateMock, isPending: ref(false) }),
    })
    const wrapper = mount(Component, { global: { stubs: { RouterLink: RouterLinkStub } } })
    await wrapper.find('form').trigger('submit')
    expect(mutateMock).toHaveBeenCalled()
  })
})
```

## Template: Teste de Composable

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

## Template: Teste de Schema Zod

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

## Template: Teste E2E de Fluxo

```typescript
import { expect, test } from '@playwright/test'

test('deve completar fluxo completo', async ({ page }) => {
  // 1. Navegar para página inicial
  await page.goto('/path')

  // 2. Preencher formulário
  await page.getByRole('textbox', { name: 'Campo 1' }).fill('valor1')
  await page.getByRole('textbox', { name: 'Campo 2' }).fill('valor2')

  // 3. Mockar resposta de API
  await page.route('**/api/endpoint', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  // 4. Submeter formulário
  await page.getByRole('button', { name: 'Submeter' }).click()

  // 5. Aguardar navegação
  await page.waitForURL('/success-path')

  // 6. Verificar resultado
  await expect(page.getByText('Sucesso')).toBeVisible()
})
```

## Template: Teste E2E de Formulário

```typescript
import { expect, test } from '@playwright/test'

test('deve validar formulário', async ({ page }) => {
  await page.goto('/form')

  // Tentar submeter sem preencher
  await page.getByRole('button', { name: 'Enviar' }).click()

  // Verificar mensagens de erro
  await expect(page.getByText('Campo obrigatório')).toBeVisible()

  // Preencher campos
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com')
  await page.getByRole('textbox', { name: 'Senha' }).fill('123456')

  // Mockar sucesso
  await page.route('**/api/submit', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  // Submeter novamente
  await page.getByRole('button', { name: 'Enviar' }).click()

  // Verificar sucesso
  await expect(page.getByText('Formulário enviado com sucesso')).toBeVisible()
})
```

## Template: Teste E2E com Múltiplas Páginas

```typescript
import { expect, test } from '@playwright/test'

test('deve navegar entre múltiplas páginas', async ({ page }) => {
  // Página 1
  await page.goto('/page1')
  await page.getByRole('button', { name: 'Próximo' }).click()
  await expect(page).toHaveURL('/page2')

  // Página 2
  await page.getByRole('textbox', { name: 'Campo' }).fill('valor')
  await page.getByRole('button', { name: 'Próximo' }).click()
  await expect(page).toHaveURL('/page3')

  // Página 3
  await expect(page.getByText('Resumo')).toBeVisible()
  await page.getByRole('button', { name: 'Confirmar' }).click()
  await expect(page).toHaveURL('/success')
})
```

## Como Usar os Templates

1. **Copie o template** mais adequado para seu caso
2. **Adapte os nomes** de componentes, composables e features
3. **Ajuste os seletores** e interações conforme necessário
4. **Adicione mocks** específicos do seu teste
5. **Personalize as assertions** para seu caso de uso

## Dicas

- Use os templates como ponto de partida
- Adapte conforme necessidade específica
- Mantenha consistência com padrões do projeto
- Adicione casos de teste adicionais conforme necessário
