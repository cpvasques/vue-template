---
name: ui-components
description: Integração e uso dos componentes UI do projeto Vue 3. Os componentes vêm do shadcn-vue (estilizados) e Reka UI (primitivos). Use quando criando componentes UI, formulários, ou precisando de componentes de interface.
---

# UI Components Integration

Guidelines completas para integração e uso dos componentes UI no projeto Vue 3 FSD. Os componentes são baseados em **shadcn-vue** e **Reka UI**.

## Princípios Fundamentais

1. **shadcn-vue First**: Componentes estilizados prontos em `src/shared/components/`
2. **Reka UI**: Primitivos unstyled para comportamento e acessibilidade
3. **Consistência Visual**: Usar componentes do projeto garante consistência
4. **Integração Tailwind**: Componentes integrados com Tailwind CSS
5. **Acessibilidade**: Componentes baseados em Reka UI incluem acessibilidade (WAI-ARIA)

## Quando Usar Esta Skill

- Criando novos componentes UI
- Implementando formulários
- Precisando de componentes de interface
- Customizando componentes existentes
- Integrando com VeeValidate
- Trabalhando com theming e dark mode

## Stack Tecnológica

- **shadcn-vue** - Componentes estilizados prontos para uso
  - Docs: https://www.shadcn-vue.com/docs/components
  - Componentes copiados em `src/shared/components/`
- **Reka UI** - Componentes primitivos unstyled (base dos shadcn-vue)
  - Docs: https://reka-ui.com/
  - Usado internamente pelos componentes shadcn-vue
- **Tailwind CSS 4.1.18** - Framework CSS utility-first
- **VeeValidate** - Integração com formulários

## Setup e Configuração

### Localização dos Componentes

Os componentes estão em `src/shared/components/`. Cada pasta contém um ou mais componentes com `index.ts` para exportação.

### Importação de Componentes

```typescript
// Importação de componentes UI do projeto
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/form'
```

## Componentes Disponíveis

**Catálogo completo:** [components.md](components.md) — lista de componentes, props e exemplos.

## Recursos Disponíveis

- [components.md](components.md) - **Catálogo completo** de componentes disponíveis
- [usage-patterns.md](usage-patterns.md) - Padrões de uso e integração
- [customization.md](customization.md) - Customização e theming

## Links de Referência

- [shadcn-vue Components](https://www.shadcn-vue.com/docs/components) - Documentação oficial
- [Reka UI](https://reka-ui.com/) - Componentes primitivos base
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [VeeValidate Docs](https://vee-validate.logaretm.com/v4/)

## Quando Usar Componentes vs Criar Custom

### ✅ Usar Componentes do Projeto

- Componentes básicos de UI (Button, Input, etc)
- Componentes de formulário
- Componentes de layout (Dialog, etc)
- Quando precisa de consistência visual
- Quando precisa de acessibilidade built-in

### ⚠️ Criar Componente Custom

- Quando não existe o componente necessário
- Quando precisa de comportamento muito específico
- Quando criando widgets compostos (usar componentes internamente)

**Padrão:** Criar wrapper custom que usa componentes do projeto internamente.
