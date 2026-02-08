# Comunicação entre Componentes

Guia completo sobre padrões de comunicação entre componentes Vue 3, incluindo props, events, provide/inject e outras estratégias.

## 📋 Visão Geral

Vue 3 oferece várias formas de comunicação entre componentes:

1. **Props Down, Events Up** - Padrão fundamental
2. **Provide/Inject** - Para componentes distantes
3. **DefineExpose** - Para acesso direto a métodos
4. **Slots** - Para conteúdo customizável
5. **Stores (Pinia)** - Para estado global

---

## 🔄 Props Down, Events Up

### Princípio Fundamental

- **Props:** Dados fluem do componente pai para o filho
- **Events:** Ações fluem do componente filho para o pai

### Exemplo Básico

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Props {
  title: string
  count: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:count': [value: number]
  'increment': []
}>()

const handleClick = () => {
  emit('update:count', props.count + 1)
  emit('increment')
}
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="handleClick">Increment</button>
  </div>
</template>

<!-- ParentComponent.vue -->
<script setup lang="ts">
import ChildComponent from './ChildComponent.vue'

const count = ref(0)

const handleIncrement = () => {
  console.log('Incremented!')
}
</script>

<template>
  <ChildComponent
    :title="'Counter'"
    :count="count"
    @update:count="count = $event"
    @increment="handleIncrement"
  />
</template>
```

### v-model (Two-Way Binding)

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <input v-model="inputValue" />
</template>

<!-- ParentComponent.vue -->
<script setup lang="ts">
const value = ref('')
</script>

<template>
  <ChildComponent v-model="value" />
</template>
```

### Múltiplos v-model

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Props {
  firstName: string
  lastName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:firstName': [value: string]
  'update:lastName': [value: string]
}>()
</script>

<template>
  <input
    :value="firstName"
    @input="emit('update:firstName', $event.target.value)"
  />
  <input
    :value="lastName"
    @input="emit('update:lastName', $event.target.value)"
  />
</template>

<!-- ParentComponent.vue -->
<script setup lang="ts">
const firstName = ref('')
const lastName = ref('')
</script>

<template>
  <ChildComponent
    v-model:first-name="firstName"
    v-model:last-name="lastName"
  />
</template>
```

---

## 👨‍👩‍👧 Comunicação Pai → Filho

### Props Simples

```vue
<!-- ParentComponent.vue -->
<template>
  <ChildComponent :user="user" :is-active="isActive" />
</template>

<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Props {
  user: User
  isActive: boolean
}

const props = defineProps<Props>()
</script>
```

### Props com Valores Padrão

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})
</script>
```

### Props Reativas

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
const props = defineProps<{ count: number }>()

// Props são reativas automaticamente
const doubled = computed(() => props.count * 2)

// Mas não podem ser modificadas diretamente
// props.count++ // ❌ Erro: Props são readonly
</script>
```

---

## 👧👨 Comunicação Filho → Pai

### Events Simples

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  'click': []
  'change': [value: string]
}>()

const handleClick = () => {
  emit('click')
}

const handleChange = (value: string) => {
  emit('change', value)
}
</script>

<!-- ParentComponent.vue -->
<template>
  <ChildComponent @click="handleClick" @change="handleChange" />
</template>
```

### Events com Payload

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  'user-selected': [user: User]
  'form-submitted': [data: FormData]
}>()

const selectUser = (user: User) => {
  emit('user-selected', user)
}
</script>

<!-- ParentComponent.vue -->
<script setup lang="ts">
const handleUserSelected = (user: User) => {
  console.log('User selected:', user)
}
</script>

<template>
  <ChildComponent @user-selected="handleUserSelected" />
</template>
```

### Validar Events (Opcional)

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  'update:value': [value: number]
}>({
  'update:value': (value: number) => {
    if (value < 0) {
      console.warn('Value cannot be negative')
      return false
    }
    return true
  },
})
</script>
```

---

## 👨‍👩‍👧‍👦 Comunicação entre Componentes Irmãos

### Via Componente Pai (Padrão)

```vue
<!-- ParentComponent.vue -->
<script setup lang="ts">
const searchTerm = ref('')
const filteredUsers = ref<User[]>([])

const handleSearch = (term: string) => {
  searchTerm.value = term
  // Filtrar usuários
}
</script>

<template>
  <SearchBar @search="handleSearch" />
  <UserList :users="filteredUsers" />
</template>
```

### Via Provide/Inject

```vue
<!-- ParentComponent.vue -->
<script setup lang="ts">
const searchTerm = ref('')

provide('searchTerm', searchTerm)
</script>

<!-- SearchBar.vue -->
<script setup lang="ts">
const searchTerm = inject<Ref<string>>('searchTerm', ref(''))

const handleInput = (value: string) => {
  searchTerm.value = value
}
</script>

<!-- UserList.vue -->
<script setup lang="ts">
const searchTerm = inject<Ref<string>>('searchTerm', ref(''))

const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.name.includes(searchTerm.value)
  )
})
</script>
```

### Via Store (Pinia)

```typescript
// stores/search.ts
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchTerm: '',
  }),
  actions: {
    setSearchTerm(term: string) {
      this.searchTerm = term
    },
  },
})
```

```vue
<!-- SearchBar.vue -->
<script setup lang="ts">
import { useSearchStore } from '@/stores/search'

const searchStore = useSearchStore()

const handleInput = (value: string) => {
  searchStore.setSearchTerm(value)
}
</script>

<!-- UserList.vue -->
<script setup lang="ts">
import { useSearchStore } from '@/stores/search'

const searchStore = useSearchStore()

const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.name.includes(searchStore.searchTerm)
  )
})
</script>
```

---

## 🎯 Padrões Avançados

### Event Bus (Não Recomendado)

```typescript
// ❌ NÃO RECOMENDADO - Use provide/inject ou stores
// shared/lib/event-bus.ts
import { ref } from 'vue'

type EventCallback = (...args: any[]) => void

class EventBus {
  private events = ref<Record<string, EventCallback[]>>({})

  on(event: string, callback: EventCallback) {
    if (!this.events.value[event]) {
      this.events.value[event] = []
    }
    this.events.value[event].push(callback)
  }

  emit(event: string, ...args: any[]) {
    if (this.events.value[event]) {
      this.events.value[event].forEach(callback => callback(...args))
    }
  }
}

export const eventBus = new EventBus()
```

**Prefira:** Provide/Inject ou Stores ao invés de Event Bus.

### Composables para Comunicação

```typescript
// composables/useDialog.ts
export function useDialog() {
  const isOpen = ref(false)

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    open,
    close,
  }
}
```

```vue
<!-- Componente que usa -->
<script setup lang="ts">
import { useDialog } from '@/composables/useDialog'

const { isOpen, open, close } = useDialog()
</script>
```

---

## ✅ Boas Práticas

### 1. Use Props para Dados, Events para Ações

```vue
<!-- ✅ CORRETO -->
<ChildComponent
  :user="user"
  :is-active="isActive"
  @click="handleClick"
  @change="handleChange"
/>

<!-- ❌ ERRADO - Não passe funções via props para ações -->
<ChildComponent :on-click="handleClick" />
```

### 2. Prefira v-model para Two-Way Binding

```vue
<!-- ✅ CORRETO -->
<InputComponent v-model="value" />

<!-- ❌ ERRADO - Verboso -->
<InputComponent
  :value="value"
  @update:value="value = $event"
/>
```

### 3. Use Provide/Inject para Múltiplos Níveis

```vue
<!-- ✅ CORRETO - Muitos níveis -->
<App>
  <Layout>
    <Page>
      <Component /> <!-- Precisa do tema -->
    </Page>
  </Layout>
</App>

<!-- ❌ ERRADO - Apenas 1 nível -->
<Parent>
  <Child /> <!-- Props são suficientes -->
</Parent>
```

### 4. Documente Props e Events

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
/**
 * Props:
 * - user: User - Dados do usuário
 * - isActive: boolean - Se está ativo
 * 
 * Events:
 * - click: [] - Disparado ao clicar
 * - change: [value: string] - Disparado ao mudar valor
 */
interface Props {
  user: User
  isActive: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'click': []
  'change': [value: string]
}>()
</script>
```

---

## ❌ Anti-Patterns

### 1. Não Modifique Props Diretamente

```vue
<!-- ❌ ERRADO -->
<script setup lang="ts">
const props = defineProps<{ count: number }>()

const increment = () => {
  props.count++ // ❌ Props são readonly
}
</script>

<!-- ✅ CORRETO -->
<script setup lang="ts">
const props = defineProps<{ count: number }>()
const emit = defineEmits<{ 'update:count': [value: number] }>()

const increment = () => {
  emit('update:count', props.count + 1) // ✅ Usa events
}
</script>
```

### 2. Não Use Event Bus Quando Há Alternativas

```typescript
// ❌ ERRADO - Event Bus desnecessário
eventBus.emit('user-updated', user)

// ✅ CORRETO - Use provide/inject ou stores
provide('user', user)
// ou
userStore.setUser(user)
```

### 3. Não Passe Props Desnecessárias

```vue
<!-- ❌ ERRADO - Props não utilizadas -->
<ChildComponent
  :user="user"
  :unused-prop="value"
/>

<!-- ✅ CORRETO - Apenas props necessárias -->
<ChildComponent :user="user" />
```

---

## 🔗 Exemplos do Projeto

### Exemplo: Formulário com Validação

```vue
<!-- features/users/handle-users/index.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  'user-created': [user: User]
  'user-updated': [user: User]
}>()

const onSubmit = (user: User) => {
  if (isEditMode.value) {
    emit('user-updated', user)
  } else {
    emit('user-created', user)
  }
}
</script>
```

### Exemplo: Lista com Filtros

```vue
<!-- features/users/list-users/index.vue -->
<script setup lang="ts">
const filters = ref({})
const emit = defineEmits<{
  'filters-changed': [filters: FilterData]
}>()

const updateFilters = (newFilters: FilterData) => {
  filters.value = newFilters
  emit('filters-changed', newFilters)
}
</script>
```

---

## 📚 Recursos Adicionais

- [Vue 3 - Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 - Events](https://vuejs.org/guide/components/events.html)
- [Vue 3 - v-model](https://vuejs.org/guide/components/v-model.html)
- [Pinia - State Management](https://pinia.vuejs.org/)

---

**Fim da Skill:** Você completou todos os tópicos de Component Composition Patterns! 🎉
