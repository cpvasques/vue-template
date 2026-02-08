# Slots e Scoped Slots

Guia completo sobre slots em Vue 3, incluindo slots básicos, scoped slots, named slots e slot props.

## 📋 O que são Slots?

Slots permitem que componentes filhos recebam conteúdo do componente pai, criando componentes flexíveis e reutilizáveis.

---

## 🎯 Slots Básicos

### Slot Padrão

O slot padrão permite passar conteúdo para o componente filho.

```vue
<!-- BaseCard.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <h2>Título</h2>
    </div>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<!-- Uso -->
<BaseCard>
  <p>Este conteúdo será renderizado no slot</p>
</BaseCard>
```

### Fallback Content

Você pode definir conteúdo padrão que será exibido se nenhum conteúdo for passado.

```vue
<!-- BaseCard.vue -->
<template>
  <div class="card">
    <slot>
      <p>Conteúdo padrão se nenhum slot for fornecido</p>
    </slot>
  </div>
</template>

<!-- Uso sem conteúdo -->
<BaseCard />
<!-- Renderiza o conteúdo padrão -->

<!-- Uso com conteúdo -->
<BaseCard>
  <p>Conteúdo customizado</p>
</BaseCard>
```

---

## 🏷️ Named Slots

Named slots permitem múltiplos slots em um componente.

### Definição

```vue
<!-- BaseLayout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header" />
    </header>
    <main>
      <slot name="default" />
    </main>
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>
```

### Uso

```vue
<BaseLayout>
  <template #header>
    <h1>Header Customizado</h1>
  </template>

  <template #default>
    <p>Conteúdo principal</p>
  </template>

  <template #footer>
    <p>Footer Customizado</p>
  </template>
</BaseLayout>
```

### Sintaxe Alternativa

```vue
<!-- Sintaxe v-slot -->
<BaseLayout>
  <template v-slot:header>
    <h1>Header</h1>
  </template>
</BaseLayout>

<!-- Sintaxe abreviada # -->
<BaseLayout>
  <template #header>
    <h1>Header</h1>
  </template>
</BaseLayout>
```

---

## 🔄 Scoped Slots

Scoped slots permitem que o componente filho passe dados para o componente pai através do slot.

### Definição

```vue
<!-- DataTable.vue -->
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

const users = ref<User[]>([
  { id: 1, name: 'João', email: 'joao@example.com' },
  { id: 2, name: 'Maria', email: 'maria@example.com' },
])
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nome</th>
        <th>Email</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>
          <slot name="actions" :user="user" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

### Uso

```vue
<script setup lang="ts">
import DataTable from '@/widgets/data-table/index.vue'

const handleEdit = (user: User) => {
  console.log('Editar:', user)
}

const handleDelete = (user: User) => {
  console.log('Deletar:', user)
}
</script>

<template>
  <DataTable>
    <template #actions="{ user }">
      <button @click="handleEdit(user)">Editar</button>
      <button @click="handleDelete(user)">Deletar</button>
    </template>
  </DataTable>
</template>
```

### Múltiplos Props no Scoped Slot

```vue
<!-- DataTable.vue -->
<template>
  <table>
    <tbody>
      <tr v-for="(user, index) in users" :key="user.id">
        <slot 
          name="row" 
          :user="user" 
          :index="index"
          :isEven="index % 2 === 0"
        />
      </tr>
    </tbody>
  </table>
</template>

<!-- Uso -->
<DataTable>
  <template #row="{ user, index, isEven }">
    <tr :class="{ 'even-row': isEven }">
      <td>{{ index + 1 }}</td>
      <td>{{ user.name }}</td>
    </tr>
  </template>
</DataTable>
```

---

## 🎨 Padrões Comuns

### Componente de Lista com Slot Customizável

```vue
<!-- UserList.vue -->
<script setup lang="ts">
interface Props {
  users: User[]
}

const props = defineProps<Props>()
</script>

<template>
  <ul class="user-list">
    <li v-for="user in users" :key="user.id">
      <slot name="item" :user="user">
        <!-- Fallback padrão -->
        <span>{{ user.name }}</span>
      </slot>
    </li>
  </ul>
</template>

<!-- Uso -->
<UserList :users="users">
  <template #item="{ user }">
    <div class="user-card">
      <img :src="user.avatar" :alt="user.name" />
      <div>
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
      </div>
    </div>
  </template>
</UserList>
```

### Componente de Formulário com Slots

```vue
<!-- FormField.vue -->
<script setup lang="ts">
interface Props {
  label: string
  error?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="form-field">
    <label>{{ label }}</label>
    <slot />
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>

<!-- Uso -->
<FormField label="Email" :error="errors.email">
  <Input v-model="email" type="email" />
</FormField>
```

### Componente de Modal com Slots

```vue
<!-- BaseModal.vue -->
<script setup lang="ts">
interface Props {
  isOpen: boolean
  title: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const close = () => {
  emit('update:isOpen', false)
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <slot name="header-actions" />
      </DialogHeader>
      
      <div class="modal-body">
        <slot />
      </div>
      
      <DialogFooter>
        <slot name="footer">
          <Button @click="close">Fechar</Button>
        </slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<!-- Uso -->
<BaseModal v-model:is-open="isOpen" title="Editar Usuário">
  <template #header-actions>
    <Button variant="ghost" @click="close">
      <X />
    </Button>
  </template>

  <form>
    <!-- Conteúdo do formulário -->
  </form>

  <template #footer>
    <Button @click="close">Cancelar</Button>
    <Button @click="save">Salvar</Button>
  </template>
</BaseModal>
```

---

## ✅ Boas Práticas

### 1. Use Named Slots para Estruturas Complexas

```vue
<!-- ✅ CORRETO -->
<BaseLayout>
  <template #header>...</template>
  <template #sidebar>...</template>
  <template #content>...</template>
</BaseLayout>
```

### 2. Forneça Fallback Content Quando Apropriado

```vue
<!-- ✅ CORRETO -->
<slot>
  <p>Conteúdo padrão útil</p>
</slot>
```

### 3. Use Scoped Slots para Dados do Componente Filho

```vue
<!-- ✅ CORRETO -->
<slot name="item" :item="item" :index="index" />
```

### 4. Documente Slots Disponíveis

```vue
<!-- Componente.vue -->
<script setup lang="ts">
/**
 * Slots disponíveis:
 * - default: Conteúdo principal
 * - header: Cabeçalho customizado
 * - footer: Rodapé customizado
 * - actions: Ações customizadas (scoped: { item })
 */
</script>
```

---

## ❌ Anti-Patterns

### 1. Não Use Slots Quando Props São Mais Apropriados

```vue
<!-- ❌ ERRADO - Slot desnecessário -->
<Button>
  <span>Clique aqui</span>
</Button>

<!-- ✅ CORRETO - Props -->
<Button label="Clique aqui" />
```

### 2. Não Passe Dados Complexos Via Slots

```vue
<!-- ❌ ERRADO -->
<slot :complexData="veryComplexObject" />

<!-- ✅ CORRETO - Passe apenas o necessário -->
<slot :id="item.id" :name="item.name" />
```

### 3. Não Abuse de Slots Aninhados

```vue
<!-- ❌ ERRADO - Muito complexo -->
<Component>
  <template #slot1>
    <Component2>
      <template #slot2>
        <!-- Muito aninhado -->
      </template>
    </Component2>
  </template>
</Component>
```

---

## 🔗 Exemplos do Projeto

### Exemplo: Sidebar com Slots

```vue
<!-- widgets/sidebar/index.vue -->
<template>
  <nav :class="sidebarClasses">
    <div class="sidebar-header">
      <slot name="header" />
    </div>
    <div class="sidebar-content">
      <slot />
    </div>
    <div class="sidebar-footer">
      <slot name="footer" />
    </div>
  </nav>
</template>
```

### Exemplo: Data Table com Scoped Slots

```vue
<!-- widgets/data-table/index.vue -->
<template>
  <table>
    <tbody>
      <tr v-for="(item, index) in items" :key="item.id">
        <slot name="row" :item="item" :index="index" />
      </tr>
    </tbody>
  </table>
</template>
```

---

## 📚 Recursos Adicionais

- [Vue 3 - Slots Documentation](https://vuejs.org/guide/components/slots.html)
- [Vue 3 - Scoped Slots](https://vuejs.org/guide/components/slots.html#scoped-slots)

---

**Próximo:** Leia [provide-inject.md](./provide-inject.md) para compartilhamento de contexto entre componentes.
