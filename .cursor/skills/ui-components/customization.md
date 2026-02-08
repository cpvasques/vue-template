# Customização e Theming

Como customizar componentes UI e trabalhar com theming. **Princípios gerais Tailwind:** `.cursor/skills/tailwind-patterns/SKILL.md`

## Customização via Props

### Classes CSS Customizadas

**✅ CORRETO - Usar prop `class`:**
```vue
<Button class="w-full mt-6" type="submit">
  Enviar
</Button>
```

**✅ CORRETO - Usar `cn()` para merge:**
```vue
<script setup lang="ts">
import { cn } from '@/app/utils/cn'

const buttonClass = computed(() =>
  cn(
    'base-class',
    condition.value && 'conditional-class',
  )
)
</script>

<template>
  <Button :class="buttonClass">Botão</Button>
</template>
```

**❌ ERRADO - Sobrescrever estilos diretamente:**
```vue
<!-- Não fazer isso -->
<Button style="background: red">Botão</Button>
```

## Integração com Tailwind CSS

Os componentes (shadcn-vue) estão integrados com Tailwind CSS:

```vue
<Button class="w-full mt-6 bg-primary hover:bg-primary/90">
  Enviar
</Button>

<Input class="w-full border-2" />
```

### Utilitário `cn()`

O projeto tem utilitário `cn()` para merge de classes:

```typescript
// app/utils/cn.ts
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Theming com CSS Variables

Variáveis disponíveis (definidas no Tailwind):
- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--destructive`, `--destructive-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--border`, `--input`, `--ring`

## Dark Mode

Suporte via classes `dark:` do Tailwind:

```vue
<div class="bg-white dark:bg-zinc-900">
  <!-- Conteúdo -->
</div>
```

### ThemeToggle

Componente para alternar tema em `@/shared/components/theme-toggle`.

## Acessibilidade

Os componentes baseados em Reka UI já incluem:
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

## Links Relacionados

- [shadcn-vue Theming](https://www.shadcn-vue.com/docs/theming)
- [Reka UI](https://reka-ui.com/) - Componentes acessíveis
