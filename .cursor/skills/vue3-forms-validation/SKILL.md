---
name: vue3-forms-validation
description: Desenvolve formulários com VeeValidate e Zod seguindo padrões do projeto. Use quando criando formulários, schemas de validação ou integrando validação com i18n.
---

# Vue 3 Forms & Validation

Guidelines completas para desenvolvimento de formulários com VeeValidate + Zod + zod-i18n-map no projeto Vue 3 FSD.

## Princípios Fundamentais

1. **VeeValidate + Zod**: Usar VeeValidate para gerenciamento de formulários e Zod para validação
2. **Schemas Tipados**: Sempre usar `toTypedSchema` para integração VeeValidate + Zod
3. **i18n Integrado**: Mensagens de erro traduzidas com zod-i18n-map
4. **Feedback Visual**: Erros inline + toast para feedback de submit
5. **Componentes UI**: Usar componentes de `@/shared/components/` (shadcn-vue) para formulários

## Quando Usar Esta Skill

- Criando novos formulários
- Criando schemas de validação Zod
- Integrando validação com i18n
- Implementando validação condicional
- Tratando erros de formulário
- Usando componentes de formulário do projeto (shadcn-vue)

## Stack Tecnológica

- **VeeValidate 4.15.1** - Gerenciamento de formulários
- **Zod 3.25.76** - Schema validation
- **@vee-validate/zod** - Integração VeeValidate + Zod
- **zod-i18n-map** - Mensagens de erro internacionalizadas
- **shadcn-vue / Reka UI** - Componentes em `@/shared/components/`

## Recursos Disponíveis

- [form-patterns.md](form-patterns.md) - Padrões de estruturação de formulários
- [validation-schemas.md](validation-schemas.md) - Padrões de schemas Zod
- [error-handling.md](error-handling.md) - Tratamento de erros em formulários
- [templates.md](templates.md) - Templates prontos para copiar e adaptar

## Configuração

### Setup do i18n para Zod

O projeto já tem i18n configurado em `app/plugins/i18n-zod.ts`:

```typescript
import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import translation from 'zod-i18n-map/locales/pt/zod.json'

export function setupI18nZod() {
  i18next.init({
    lng: 'pt',
    resources: {
      pt: {
        zod: translation,
      },
    },
  })

  z.setErrorMap(zodI18nMap)
}
```

**Não precisa configurar manualmente** - já está no `main.ts`.

## Convenções

- **Schemas**: Criar em `features/[feature]/model/[feature]Schema.ts`
- **Tipos**: Usar `z.infer<typeof schema>` para tipos derivados
- **Validação**: `validateOnMount: false` por padrão
- **Submit**: Validar antes de submeter com `validate()`
- **Erros**: Exibir inline com `FormMessage` e toast para erros de submit

## Links Relacionados

- [VeeValidate Docs](https://vee-validate.logaretm.com/v4/)
- [Zod Docs](https://zod.dev/)
- [zod-i18n-map](https://github.com/aiji42/zod-i18n-map)
