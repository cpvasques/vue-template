# Testes E2E com Playwright

Padrões e templates para testes end-to-end usando Playwright.

## Setup Básico

### Configuração

O projeto usa Playwright configurado em `playwright.config.ts`:

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './playwright',
  baseURL: 'http://localhost:8080',
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080/',
    reuseExistingServer: true,
  },
})
```

### Imports Padrão

```typescript
import { expect, test } from '@playwright/test'
```

## Estrutura de Testes

### Organização por Feature/Flow

```
playwright/
├── login/
│   ├── login-flow.spec.ts
│   ├── login-flow-wrong.spec.ts
│   └── login-flow-blank.spec.ts
├── users/
│   ├── users-new-profile.spec.ts
│   └── users-edit-profile.spec.ts
└── recover-password/
    └── recover-password.spec.ts
```

## Padrão Básico

### Template Completo

```typescript
import { expect, test } from '@playwright/test'

test('deve executar fluxo completo', async ({ page }) => {
  // Navegar para página
  await page.goto('/path')

  // Interagir com elementos
  await page.getByRole('textbox', { name: 'Campo' }).fill('valor')
  await page.getByRole('button', { name: 'Botão' }).click()

  // Verificar resultado
  await expect(page).toHaveURL('/expected-path')
  await expect(page.getByText('Texto esperado')).toBeVisible()
})
```

## Seletores Recomendados

### ✅ Preferir (Mais Estáveis)

```typescript
// Por role (melhor opção)
await page.getByRole('button', { name: 'Entrar' }).click()
await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com')
await page.getByRole('link', { name: 'Esqueci minha senha' }).click()

// Por texto
await page.getByText('Texto exato').click()
await page.getByText(/regex/).click()

// Por label
await page.getByLabel('Email').fill('test@example.com')
```

### ⚠️ Usar com Cautela

```typescript
// Por seletor CSS (menos estável)
await page.locator('.classe').click()
await page.locator('#id').click()

// Por data-testid (se disponível)
await page.getByTestId('submit-button').click()
```

## Padrões de Navegação

### Navegação Básica

```typescript
test('deve navegar entre páginas', async ({ page }) => {
  await page.goto('/auth/login')
  await expect(page).toHaveURL('/auth/login')
  
  await page.getByRole('link', { name: 'Cadastre-se' }).click()
  await expect(page).toHaveURL('/auth/register')
})
```

### Aguardar Navegação

```typescript
test('deve aguardar navegação', async ({ page }) => {
  await page.goto('/auth/login')
  
  // Aguardar elemento aparecer
  await page.waitForSelector('text=Entrar')
  
  // Aguardar navegação
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL('/dashboard')
  
  // Aguardar estado de rede
  await page.waitForLoadState('networkidle')
})
```

## Interações com Formulários

### Preencher Formulário

```typescript
test('deve preencher formulário de login', async ({ page }) => {
  await page.goto('/auth/login')
  
  // Preencher campos
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com')
  await page.getByRole('textbox', { name: 'Senha' }).fill('123456')
  
  // Submeter
  await page.getByRole('button', { name: 'Entrar' }).click()
  
  // Verificar resultado
  await expect(page).toHaveURL('/dashboard')
})
```

### Validação de Formulário

```typescript
test('deve validar campos obrigatórios', async ({ page }) => {
  await page.goto('/auth/login')
  
  // Tentar submeter sem preencher
  await page.getByRole('button', { name: 'Entrar' }).click()
  
  // Verificar mensagens de erro
  await expect(page.getByText('E-mail é obrigatório')).toBeVisible()
  await expect(page.getByText('Senha é obrigatória')).toBeVisible()
})
```

## Mocking de APIs

### Interceptar Requisições

```typescript
test('deve mockar resposta de API', async ({ page }) => {
  await page.goto('/auth/login')
  
  // Interceptar requisição
  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'mock-token',
        user: { id: 1, name: 'Test User' },
      }),
    })
  })
  
  // Preencher e submeter
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com')
  await page.getByRole('textbox', { name: 'Senha' }).fill('123456')
  await page.getByRole('button', { name: 'Entrar' }).click()
  
  // Verificar navegação após sucesso
  await expect(page).toHaveURL('/dashboard')
})
```

### Simular Erros

```typescript
test('deve tratar erro de API', async ({ page }) => {
  await page.goto('/auth/login')
  
  // Mockar erro
  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Credenciais inválidas',
      }),
    })
  })
  
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com')
  await page.getByRole('textbox', { name: 'Senha' }).fill('wrong')
  await page.getByRole('button', { name: 'Entrar' }).click()
  
  // Verificar mensagem de erro
  await expect(page.getByText('Credenciais inválidas')).toBeVisible()
})
```

## Aguardar Estados

### Aguardar Elementos

```typescript
// Aguardar elemento aparecer
await page.waitForSelector('text=Carregando...', { state: 'hidden' })

// Aguardar elemento estar visível
await expect(page.getByText('Sucesso')).toBeVisible()

// Aguardar elemento desaparecer
await expect(page.getByText('Carregando...')).not.toBeVisible()
```

### Aguardar Estados de Rede

```typescript
// Aguardar todas as requisições terminarem
await page.waitForLoadState('networkidle')

// Aguardar DOM carregar
await page.waitForLoadState('domcontentloaded')

// Aguardar carregamento completo
await page.waitForLoadState('load')
```

## Verificações (Assertions)

### Verificações Comuns

```typescript
// URL
await expect(page).toHaveURL('/expected-path')
await expect(page).toHaveURL(/regex/)

// Texto
await expect(page.getByText('Texto')).toBeVisible()
await expect(page.getByText('Texto')).toHaveText('Texto exato')

// Atributos
await expect(page.getByRole('button')).toBeEnabled()
await expect(page.getByRole('button')).toBeDisabled()

// Contagem
await expect(page.getByRole('listitem')).toHaveCount(5)

// Valores de input
await expect(page.getByRole('textbox')).toHaveValue('valor')
```

## Fluxos Complexos

### Exemplo: Fluxo de Login Completo

```typescript
import { expect, test } from '@playwright/test'

test('deve completar fluxo de login com 2FA', async ({ page }) => {
  // 1. Navegar para login
  await page.goto('/auth/login')
  
  // 2. Preencher credenciais
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com')
  await page.getByRole('textbox', { name: 'Senha' }).fill('123456')
  
  // 3. Mockar resposta de login
  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ requires2FA: true }),
    })
  })
  
  // 4. Submeter
  await page.getByRole('button', { name: 'Entrar' }).click()
  
  // 5. Verificar redirecionamento para 2FA
  await expect(page).toHaveURL('/auth/two-factor-auth')
  
  // 6. Preencher código 2FA
  for (let i = 1; i <= 6; i++) {
    await page.getByRole('textbox', { name: `pin input ${i} of` }).fill(i.toString())
  }
  
  // 7. Mockar resposta de 2FA
  await page.route('**/auth/2fa', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'mock-token' }),
    })
  })
  
  // 8. Verificar código
  await page.getByRole('button', { name: 'Verificar' }).click()
  
  // 9. Verificar redirecionamento para dashboard
  await expect(page).toHaveURL('/dashboard')
})
```

## Boas Práticas

### ✅ FAZER

- Usar seletores por role quando possível
- Aguardar estados antes de interagir
- Mockar APIs para testes isolados
- Organizar testes por feature/flow
- Usar nomes descritivos em português
- Verificar múltiplos aspectos (URL, texto, estado)
- Limpar estado entre testes

### ❌ NÃO FAZER

- Não usar seletores CSS frágeis
- Não esquecer de aguardar elementos
- Não depender de dados reais da API
- Não criar testes muito longos
- Não misturar múltiplos fluxos em um teste

## Exemplo Real do Projeto

Baseado em `playwright/login/login-flow.spec.ts`:

```typescript
import { expect, test } from '@playwright/test'

test('Valida fluxo de login', async ({ page }) => {
  await page.goto('/auth/login')
  await page.getByRole('textbox', { name: 'm@example.com' }).click()
  await page.getByRole('textbox', { name: 'm@example.com' }).fill('dev@teste.com')
  await page.getByRole('textbox', { name: 'Senha' }).click()
  await page.getByRole('textbox', { name: 'Senha' }).fill('123456')
  await page.getByRole('button', { name: 'Entrar' }).click()
  
  await page.route('http://localhost:8080/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Mocked response' }),
    })
  })
  
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveURL('/auth/two-factor-auth')
})
```

## Recursos Adicionais

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors](https://playwright.dev/docs/selectors)
