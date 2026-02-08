---
description: "Executar com: @complexity-analysis ou 'analisar complexidade [feature]'"
globs: []
alwaysApply: false
---

# Regra de Análise de Complexidade

**ATIVAÇÃO**: Esta regra deve ser usada APENAS quando o usuário solicitar explicitamente análise de complexidade usando:
- Menção `@complexity-analysis` no chat
- Comandos como "analisar complexidade", "verificar complexidade", "executar análise de complexidade"
- Questões sobre acoplamento de features, coesão de componentes ou limites arquiteturais
- Solicitações para auditar ou revisar arquitetura de features
- Dúvidas sobre violações de dependências FSD
- Análise de performance e otimização de componentes

**NÃO** aplicar esta regra automaticamente para tarefas gerais de desenvolvimento.

---

Esta regra fornece diretrizes para analisar complexidade local e global na arquitetura FSD (Feature-Sliced Design).

## Métricas de Complexidade

### Complexidade de Features

Analisar:
- **Tamanho**: Número de arquivos, linhas de código
- **Responsabilidades**: Quantas responsabilidades a feature possui
- **Dependências**: Quantas dependências externas (widgets, shared, outras features)
- **Coesão**: Quão relacionadas são as partes da feature

**Alerta se:**
- Feature tem mais de 10 arquivos
- Feature importa de mais de 5 módulos externos
- Lógica de negócio misturada com UI
- Múltiplas responsabilidades não relacionadas

### Complexidade de Componentes

Analisar:
- **Linhas de código**: Componentes devem ter < 300 linhas
- **Complexidade ciclomática**: Métodos devem ter < 10 níveis
- **Props**: Componentes devem ter < 10 props
- **Watchers/Computed**: Evitar mais de 5 watchers/computed por componente

**Alerta se:**
- Componente > 300 linhas (considerar dividir)
- Mais de 10 props (considerar usar objeto ou composable)
- Lógica complexa no template (mover para computed/methods)

### Complexidade de Composables

Analisar:
- **Responsabilidade única**: Um composable = uma responsabilidade
- **Dependências**: Quantas dependências externas
- **Reatividade**: Quantos refs/computed/watchers

**Alerta se:**
- Composable > 200 linhas
- Mais de 5 dependências externas
- Múltiplas responsabilidades não relacionadas

### Acoplamento entre Camadas

Verificar violações FSD:
- ❌ Features importando de `pages/`
- ❌ Widgets importando de `features/` ou `pages/`
- ❌ Shared importando de outras camadas
- ❌ Dependências circulares

**Alerta se:**
- Qualquer violação de hierarquia FSD detectada
- Dependências circulares entre features
- Importações cruzadas entre camadas

### Complexidade de APIs

Analisar:
- **Tamanho de payloads**: Payloads devem ser < 50KB
- **Número de endpoints**: Feature não deve depender de > 10 endpoints
- **Tipos**: Tipos devem ser bem definidos e reutilizáveis

**Alerta se:**
- Payloads muito grandes (considerar paginação/filtros)
- Muitas chamadas de API sequenciais (considerar paralelização)
- Tipos duplicados ou mal definidos

## Checklist de Análise

Ao analisar complexidade, verificar:

### Arquitetura
- [ ] Respeita hierarquia FSD (app → pages → features → widgets → shared)
- [ ] Sem dependências circulares
- [ ] Features são auto-contidas
- [ ] Responsabilidades bem definidas

### Componentes
- [ ] Componentes < 300 linhas
- [ ] Props < 10 por componente
- [ ] Complexidade ciclomática < 10
- [ ] Lógica separada da apresentação

### Composables
- [ ] Composables < 200 linhas
- [ ] Responsabilidade única
- [ ] Dependências mínimas
- [ ] Reutilizáveis

### Performance
- [ ] Lazy loading implementado onde necessário
- [ ] Vue Query configurado corretamente
- [ ] Sem re-renderizações desnecessárias
- [ ] Bundle size otimizado

### Manutenibilidade
- [ ] Código legível e bem documentado
- [ ] Testes adequados
- [ ] Tipos TypeScript completos
- [ ] Sem código duplicado

## Recomendações de Refatoração

Se complexidade alta detectada:

1. **Dividir features grandes**: Separar em sub-features
2. **Extrair componentes**: Dividir componentes grandes em menores
3. **Criar composables**: Extrair lógica complexa para composables
4. **Reorganizar camadas**: Mover código para camada apropriada
5. **Reduzir dependências**: Usar dependency injection ou eventos
6. **Otimizar imports**: Usar lazy loading e code splitting
