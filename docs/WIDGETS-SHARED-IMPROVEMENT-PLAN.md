# Plano de Melhoria: Widgets e Shared (FSD)

Documento de planejamento para reorganização da estrutura `src/widgets` e `src/shared` conforme a arquitetura Feature-Sliced Design (FSD), eliminando confusões e duplicações.

---

## 1. Diagnóstico Atual

### 1.1 Estrutura Atual de `shared/`

```
shared/
├── api/                    # Chamadas API (ok)
├── components/             # ~50 componentes UI (shadcn-vue)
├── mocks/                  # MSW handlers (ok)
├── store/                  # theme.ts (ok)
└── ui/                     # ⚠️ Confuso
    ├── assets/             # images, tailwind.css
    ├── Icons/              # AppLogo.vue
    └── layouts/            # Auth.vue, Default.vue
```

### 1.2 Estrutura Atual de `widgets/`

```
widgets/
├── header/                 # Header da aplicação
│   └── ui/                 # HamburgerButton, HeaderLogo, HeaderProfile
├── sidebar/                # Menu lateral de navegação
│   └── ui/                 # SidebarIcons, SidebarItem
├── (page-loader movido para shared/ui)
├── page-title/             # Título de página + slot actions
├── pagination/             # Paginação composta
└── table-loader/           # ⚠️ Duplicado com shared/components/table-loader
```

### 1.3 Problemas Identificados

| Problema | Descrição | Impacto |
|----------|-----------|---------|
| **1. shared/ui vs shared/components** | Dois lugares para UI: `shared/ui` (layouts, assets, ícones) e `shared/components` (primitivos). Nomenclatura inconsistente. | Confusão sobre onde colocar novos componentes |
| **2. Duplicação table-loader** | `widgets/table-loader` e `shared/components/table-loader` fazem a mesma coisa (tabela skeleton). O de shared é mais customizável. | Código duplicado, manutenção duplicada |
| **3. Conflito de nomes: sidebar** | ✅ Resolvido: `shared/components/collapsible-sidebar` vs `widgets/sidebar` |
| **4. page-loader e page-title** | São blocos simples e genéricos. Podem ser `shared` ou permanecer em `widgets` conforme critério FSD. | Decisão arquitetural pendente |
| **5. Layouts em shared/ui** | `Default.vue` compõe Header + Sidebar (widgets). Relação layout ↔ widget não está clara na estrutura. | Ok na prática, mas documentação frágil |
| **6. Import relativo incorreto** | `HeaderLogo.vue` usa `../../../widgets/header/ui/HamburgerButton.vue` em vez de `./HamburgerButton.vue` | Bug de importação |

---

## 2. Princípios FSD Aplicados

### 2.1 Regras de Dependência

```
app → pages → features → widgets → shared
```

- **shared**: não depende de outras camadas
- **widgets**: depende apenas de shared
- **features/pages**: podem usar widgets e shared

### 2.2 Critério de Separação

| Camada | Função | Exemplo |
|--------|--------|---------|
| **shared** | Primitivos, UI genérica, sem regra de negócio | Button, Input, Skeleton, layouts base |
| **widgets** | Blocos compostos que combinam shared + lógica de UI | Header (logo + perfil), Sidebar (nav), Pagination (buttons + lógica) |

---

## 3. Plano de Ação

### Fase 1: Correções Urgentes (Baixo Risco)

#### 1.1 Corrigir import em HeaderLogo.vue

**Arquivo:** `src/widgets/header/ui/HeaderLogo.vue`

```diff
- import HamburgerButton from '../../../widgets/header/ui/HamburgerButton.vue'
+ import HamburgerButton from './HamburgerButton.vue'
```

#### 1.2 Resolver duplicação table-loader

**Ação:** Unificar em um único componente.

- **Manter:** `shared/components/table-loader` (mais completo, com props de customização)
- **Remover:** `widgets/table-loader`
- **Atualizar:** Qualquer referência futura para `@/shared/components/table-loader`
- **Nota:** Nenhum arquivo fonte usa table-loader atualmente; apenas docs. Se houver uso em lazy loading, migrar para shared.

---

### Fase 2: Desambiguação de Nomenclatura

#### 2.1 Renomear shared/components/sidebar → shared/components/app-sidebar ou collapsible-panel

**Problema:** Nome colide com `widgets/sidebar` (menu de navegação).

**Opções:**

| Opção | Prós | Contras |
|-------|------|---------|
| **A) Manter sidebar** | Shadcn padrão | Continua confuso |
| **B) Renomear para collapsible-panel** | Nome descritivo | Quebra imports existentes |
| **C) Manter e documentar** | Sem breaking changes | Confusão permanece |

**Recomendação:** **Opção C** (curto prazo) + documentar na doc de componentes que:
- `@/shared/components/collapsible-sidebar` = componente shadcn de painel colapsável
- `@/widgets/sidebar` = menu de navegação da aplicação

**Fase futura:** Se o shadcn sidebar for pouco usado, considerar alias ou renomear para `CollapsibleSidebar` no shared.

---

### Fase 3: Reorganização de shared/ui

#### 3.1 Objetivo

Deixar claro o que vai em `shared/ui` vs `shared/components`.

**Proposta de estrutura:**

```
shared/
├── api/
├── components/              # Primitivos UI (Button, Input, etc.) - sem mudança
├── ui/                     # Agrupar: assets, layouts, ícones
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── icons/              # Renomear Icons → icons (convenção)
│   │   └── AppLogo.vue
│   └── layouts/
│       ├── Auth.vue
│       └── Default.vue
├── mocks/
└── store/
```

**Mudanças:**

1. **Renomear** `shared/ui/Icons` → `shared/ui/icons` (kebab-case)
2. **Documentar** que `shared/ui` = assets, layouts, ícones; `shared/components` = componentes Vue reutilizáveis

---

### Fase 4: Clarificação Widgets vs Shared

#### 4.1 Critério para “widget” vs “shared”

| Critério | shared | widgets |
|----------|--------|---------|
| Composição | Componente atômico ou grupo pequeno | Combina vários shared + lógica |
| Regra de negócio | Nenhuma | Pode ter lógica de UI (ex: paginação) |
| Uso | Qualquer camada | Features, pages |
| Exemplo | Skeleton, Button | Header (logo + perfil + tema), Pagination |

#### 4.2 Reclassificação de widgets atuais

| Widget | Decisão | Justificativa |
|--------|---------|---------------|
| **header** | Manter em widgets | Composição: Logo + Perfil + Hamburger. Específico da app. |
| **sidebar** | Manter em widgets | Menu de navegação, depende de rotas. |
| **page-title** | Manter em widgets | Padrão de layout de página. Pode ser usado em várias páginas. |
| **page-loader** | ✅ Movido para shared/ui | Loader full-screen genérico. |
| **pagination** | Manter em widgets | Composta: Pagination + Button + eventos. Lógica de página. |
| **table-loader** | Remover (unificar com shared) | Ver Fase 1.2 |

---

### Fase 5: Documentação e Convenções

#### 5.1 Atualizar architecture.md

- Adicionar seção "Shared: ui vs components"
- Explicar diferença entre `shared/components/sidebar` e `widgets/sidebar`
- Incluir checklist: "Onde colocar meu componente?"

#### 5.2 Checklist para novos componentes

```
□ É um primitivo (Button, Input, Skeleton)? → shared/components
□ É asset, ícone ou layout base? → shared/ui
□ Combina vários shared e tem lógica de UI? → widgets
□ Tem regra de negócio? → features
```

---

## 4. Resumo de Ações

| Prioridade | Ação | Esforço | Status |
|------------|------|---------|--------|
| P0 | Corrigir import HeaderLogo.vue | Baixo | ✅ Concluído |
| P1 | Unificar table-loader (remover widgets/table-loader) | Baixo | ✅ Concluído |
| P2 | Renomear Icons → icons (shared/ui) | Baixo | ✅ Concluído |
| P3 | Documentar shared/ui vs shared/components | Médio | ✅ Concluído |
| P3 | Documentar sidebar (shared vs widgets) | Médio | ✅ Concluído |
| P4 | Mover page-loader → shared/ui | Médio | ✅ Concluído |
| P5 | Renomear shared/components/sidebar → collapsible-sidebar | Alto | ✅ Concluído |

---

## 5. Ordem de Execução Sugerida

1. ~~**Sprint 1:** P0 + P1 (correções e unificação)~~ ✅
2. ~~**Sprint 2:** P2 + P3 (documentação e convenções)~~ ✅
3. ~~**Backlog:** P4, P5~~ ✅ Concluído

---

## 6. Referências

- [Architecture FSD](../.cursor/skills/vue3-fsd-development/architecture.md)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [UI Components Skill](../.cursor/skills/ui-components/SKILL.md)
