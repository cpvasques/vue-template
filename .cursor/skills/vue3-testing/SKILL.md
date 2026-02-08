---
name: vue3-testing
description: Desenvolve testes unitários com Vitest e testes E2E com Playwright seguindo padrões do projeto. Use quando criando ou modificando testes, ou quando precisar de templates e padrões de teste.
---

# Vue 3 Testing

Guidelines completas para desenvolvimento de testes unitários (Vitest) e testes E2E (Playwright) no projeto Vue 3 FSD.

## Princípios Fundamentais

1. **Testes junto ao código**: Testes unitários em `__tests__/` dentro de cada feature/componente
2. **E2E por fluxo**: Testes E2E organizados por feature/flow em `playwright/`
3. **Mocking consistente**: MSW para APIs, mocks para dependências externas
4. **Cobertura adequada**: Testar casos principais e edge cases
5. **Manutenibilidade**: Testes claros, legíveis e fáceis de manter

## Quando Usar Esta Skill

- Criando novos testes unitários ou E2E
- Modificando testes existentes
- Dúvidas sobre padrões de teste do projeto
- Precisa de templates de teste
- Configurando mocks e stubs
- Organizando estrutura de testes

## Estrutura de Testes

### Testes Unitários (Vitest)
```
src/
└── features/
    └── [feature-name]/
        ├── __tests__/
        │   └── [feature].spec.ts
        └── index.vue
```

### Testes E2E (Playwright)
```
playwright/
└── [feature-name]/
    ├── [feature]-flow.spec.ts
    └── [feature]-[scenario].spec.ts
```

## Recursos Disponíveis

- [unit-testing.md](unit-testing.md) - Padrões e templates de testes unitários
- [e2e-testing.md](e2e-testing.md) - Padrões e templates de testes E2E
- [mocking-patterns.md](mocking-patterns.md) - Padrões de mocking com MSW e stubs
- [templates.md](templates.md) - Templates prontos para copiar e adaptar

## Configuração

### Vitest
- Configuração em `vitest.config.ts`
- Ambiente: `jsdom`
- Exclui: `e2e/**`, `playwright/**`

### Playwright
- Configuração em `playwright.config.ts`
- Base URL: `http://localhost:8080`
- Browsers: Chromium, Firefox, WebKit

## Convenções

- **Nomenclatura**: `[nome].spec.ts` para unitários, `[nome].spec.ts` para E2E
- **Describe blocks**: Descrever o que está sendo testado
- **Test names**: Em português, descritivos do comportamento esperado
- **Arrange-Act-Assert**: Estrutura clara dos testes

## Links Relacionados

- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [MSW](https://mswjs.io/)
