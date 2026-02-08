# Skill: Component Composition Patterns

Guia completo de padrões de composição de componentes Vue 3, incluindo slots, provide/inject, expose e comunicação entre componentes.

## 📋 Quando Usar Esta Skill

Use esta skill quando:
- Criando componentes reutilizáveis que precisam de flexibilidade
- Implementando comunicação entre componentes pais e filhos
- Compartilhando estado ou funcionalidades entre componentes aninhados
- Expondo métodos de componentes filhos para componentes pais
- Criando componentes com conteúdo customizável via slots

## 🎯 Princípios Fundamentais

### 1. Props Down, Events Up
- **Props:** Dados fluem do componente pai para o filho
- **Events:** Ações fluem do componente filho para o pai
- **Padrão fundamental** da comunicação Vue

### 2. Composição sobre Herança
- Prefira composição de componentes ao invés de herança
- Use slots para conteúdo customizável
- Use provide/inject para compartilhar contexto

### 3. Exposição Explícita
- Use `defineExpose` para expor métodos/propriedades necessários
- Documente o que é exposto
- Mantenha a API do componente clara

## 📚 Estrutura da Skill

Esta skill está organizada em:

1. **[slots.md](./slots.md)** - Slots básicos, scoped slots e named slots
2. **[provide-inject.md](./provide-inject.md)** - Compartilhamento de contexto com provide/inject
3. **[expose.md](./expose.md)** - Exposição de métodos e propriedades com defineExpose
4. **[communication.md](./communication.md)** - Padrões de comunicação entre componentes

## 🔗 Links Relacionados

- [Documentação Vue 3 - Slots](https://vuejs.org/guide/components/slots.html)
- [Documentação Vue 3 - Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)
- [Documentação Vue 3 - defineExpose](https://vuejs.org/api/sfc-script-setup.html#defineexpose)
- [Skill: Vue 3 FSD Development](../vue3-fsd-development/SKILL.md) - Arquitetura e padrões do projeto

## 💡 Exemplo Rápido

### Slots Básicos

```vue
<!-- Componente Base -->
<template>
  <div class="card">
    <slot />
  </div>
</template>

<!-- Uso -->
<BaseCard>
  <p>Conteúdo customizado</p>
</BaseCard>
```

### Provide/Inject

```vue
<!-- Componente Pai -->
<script setup lang="ts">
provide('theme', 'dark')
</script>

<!-- Componente Filho (qualquer nível) -->
<script setup lang="ts">
const theme = inject('theme', 'light')
</script>
```

### DefineExpose

```vue
<!-- Componente Filho -->
<script setup lang="ts">
const openDialog = () => {
  // ...
}

defineExpose({
  openDialog,
})
</script>

<!-- Componente Pai -->
<script setup lang="ts">
const childRef = ref<InstanceType<typeof ChildComponent>>()

const handleOpen = () => {
  childRef.value?.openDialog()
}
</script>
```

---

**Próximos Passos:**
- Leia [slots.md](./slots.md) para entender slots em detalhes
- Leia [provide-inject.md](./provide-inject.md) para compartilhamento de contexto
- Leia [expose.md](./expose.md) para expor métodos
- Leia [communication.md](./communication.md) para padrões de comunicação
