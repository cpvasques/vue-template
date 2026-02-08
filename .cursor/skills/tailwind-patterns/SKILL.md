---
name: tailwind-patterns
description: Princípios do Tailwind CSS v4. Configuração CSS-first, container queries, padrões modernos, arquitetura de design tokens.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Padrões Tailwind CSS (v4 - 2025)

> CSS utility-first moderno com configuração nativa em CSS.

---

## 1. Arquitetura Tailwind v4

### O que Mudou em relação ao v3

| v3 (Legado) | v4 (Atual) |
|-------------|-------------|
| `tailwind.config.js` | Diretiva baseada em CSS `@theme` |
| Plugin PostCSS | Engine Oxide (10x mais rápido) |
| Modo JIT | Nativo, sempre ativo |
| Sistema de plugins | Recursos nativos em CSS |
| Diretiva `@apply` | Ainda funciona, desencorajado |

### Conceitos Principais do v4

| Conceito | Descrição |
|----------|-----------|
| **CSS-first** | Configuração em CSS, não em JavaScript |
| **Engine Oxide** | Compilador em Rust, muito mais rápido |
| **Nesting Nativo** | Aninhamento CSS sem PostCSS |
| **Variáveis CSS** | Todos os tokens expostos como vars `--*` |

---

## 2. Configuração Baseada em CSS

### Definição de Tema

```
@theme {
  /* Cores - use nomes semânticos */
  --color-primary: oklch(0.7 0.15 250);
  --color-surface: oklch(0.98 0 0);
  --color-surface-dark: oklch(0.15 0 0);
  
  /* Escala de espaçamento */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  
  /* Tipografia */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Quando Estender vs Sobrescrever

| Ação | Usar Quando |
|------|-------------|
| **Estender** | Adicionar novos valores junto aos padrões |
| **Sobrescrever** | Substituir escala padrão inteiramente |
| **Tokens semânticos** | Nomenclatura específica do projeto (primary, surface) |

---

## 3. Container Queries (Nativo no v4)

### Breakpoint vs Container

| Tipo | Responde A |
|------|------------|
| **Breakpoint** (`md:`) | Largura do viewport |
| **Container** (`@container`) | Largura do elemento pai |

### Uso de Container Query

| Padrão | Classes |
|--------|---------|
| Definir container | `@container` no pai |
| Breakpoint do container | `@sm:`, `@md:`, `@lg:` nos filhos |
| Containers nomeados | `@container/card` para especificidade |

### Quando Usar

| Cenário | Usar |
|---------|------|
| Layouts em nível de página | Breakpoints de viewport |
| Responsivo em nível de componente | Container queries |
| Componentes reutilizáveis | Container queries (independente do contexto) |

---

## 4. Design Responsivo

### Sistema de Breakpoints

| Prefixo | Largura Mín. | Alvo |
|---------|--------------|------|
| (nenhum) | 0px | Base mobile-first |
| `sm:` | 640px | Celular grande / tablet pequeno |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |
| `2xl:` | 1536px | Desktop grande |

### Princípio Mobile-First

1. Escreva os estilos mobile primeiro (sem prefixo)
2. Adicione sobrescritas para telas maiores com prefixos
3. Exemplo: `w-full md:w-1/2 lg:w-1/3`

---

## 5. Modo Escuro

### Estratégias de Configuração

| Método | Comportamento | Usar Quando |
|--------|---------------|-------------|
| `class` | Classe `.dark` alterna | Alternador manual de tema |
| `media` | Segue preferência do sistema | Sem controle do usuário |
| `selector` | Seletor customizado (v4) | Tematização complexa |

### Padrão de Modo Escuro

| Elemento | Claro | Escuro |
|----------|-------|--------|
| Fundo | `bg-white` | `dark:bg-zinc-900` |
| Texto | `text-zinc-900` | `dark:text-zinc-100` |
| Bordas | `border-zinc-200` | `dark:border-zinc-700` |

---

## 6. Padrões de Layout Modernos

### Padrões Flexbox

| Padrão | Classes |
|--------|---------|
| Centralizar (ambos eixos) | `flex items-center justify-center` |
| Empilhamento vertical | `flex flex-col gap-4` |
| Linha horizontal | `flex gap-4` |
| Espaço entre | `flex justify-between items-center` |
| Grid com wrap | `flex flex-wrap gap-4` |

### Padrões Grid

| Padrão | Classes |
|--------|---------|
| Auto-fit responsivo | `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]` |
| Assimétrico (Bento) | `grid grid-cols-3 grid-rows-2` com spans |
| Layout com sidebar | `grid grid-cols-[auto_1fr]` |

> **Nota:** Prefira layouts assimétricos/Bento em vez de grids simétricos de 3 colunas.

---

## 7. Sistema de Cores Moderno

### OKLCH vs RGB/HSL

| Formato | Vantagem |
|---------|----------|
| **OKLCH** | Perceptualmente uniforme, melhor para design |
| **HSL** | Matiz/saturação intuitivos |
| **RGB** | Compatibilidade legada |

### Arquitetura de Tokens de Cor

| Camada | Exemplo | Propósito |
|--------|---------|-----------|
| **Primitivo** | `--blue-500` | Valores de cor brutos |
| **Semântico** | `--color-primary` | Nomenclatura por propósito |
| **Componente** | `--button-bg` | Específico do componente |

---

## 8. Sistema de Tipografia

### Padrão de Font Stack

| Tipo | Recomendado |
|------|-------------|
| Sans | `'Inter', 'SF Pro', system-ui, sans-serif` |
| Mono | `'JetBrains Mono', 'Fira Code', monospace` |
| Display | `'Outfit', 'Poppins', sans-serif` |

### Escala de Tipo

| Classe | Tamanho | Uso |
|--------|---------|-----|
| `text-xs` | 0.75rem | Labels, legendas |
| `text-sm` | 0.875rem | Texto secundário |
| `text-base` | 1rem | Texto corpo |
| `text-lg` | 1.125rem | Texto de destaque |
| `text-xl`+ | 1.25rem+ | Títulos |

---

## 9. Animação e Transições

### Animações Incorporadas

| Classe | Efeito |
|--------|--------|
| `animate-spin` | Rotação contínua |
| `animate-ping` | Pulso de atenção |
| `animate-pulse` | Pulso sutil de opacidade |
| `animate-bounce` | Efeito de quique |

### Padrões de Transição

| Padrão | Classes |
|--------|---------|
| Todas as propriedades | `transition-all duration-200` |
| Específico | `transition-colors duration-150` |
| Com easing | `ease-out` ou `ease-in-out` |
| Efeito hover | `hover:scale-105 transition-transform` |

---

## 10. Extração de Componentes

### Quando Extrair

| Sinal | Ação |
|-------|------|
| Mesma combinação de classes 3+ vezes | Extrair componente |
| Variantes de estado complexas | Extrair componente |
| Elemento do design system | Extrair + documentar |

### Métodos de Extração

| Método | Usar Quando |
|--------|-------------|
| **Componente React/Vue** | Dinâmico, precisa de JS |
| **@apply em CSS** | Estático, não precisa de JS |
| **Design tokens** | Valores reutilizáveis |

---

## 11. Anti-Padrões

| Não Fazer | Fazer |
|-----------|-------|
| Valores arbitrários em todo lugar | Usar escala do design system |
| `!important` | Corrigir especificidade corretamente |
| `style=` inline | Usar utilities |
| Duplicar listas longas de classes | Extrair componente |
| Misturar config v3 com v4 | Migrar completamente para CSS-first |
| Usar `@apply` excessivamente | Preferir componentes |

---

## 12. Princípios de Performance

| Princípio | Implementação |
|-----------|---------------|
| **Purge de não usados** | Automático no v4 |
| **Evitar dinamismo** | Sem classes em template strings |
| **Usar Oxide** | Padrão no v4, 10x mais rápido |
| **Cache de builds** | Cache em CI/CD |

---

> **Lembre-se:** O Tailwind v4 é CSS-first. Adote variáveis CSS, container queries e recursos nativos. O arquivo de config agora é opcional.
>
> **Uso com Componentes UI:** Para theming e customização dos componentes (shadcn-vue / Reka UI), ver `.cursor/skills/ui-components/customization.md`.
