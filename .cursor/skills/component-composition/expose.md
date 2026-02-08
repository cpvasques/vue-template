# DefineExpose

Guia completo sobre `defineExpose` em Vue 3 para expor métodos e propriedades de componentes filhos para componentes pais.

## 📋 O que é defineExpose?

Por padrão, componentes usando `<script setup>` não expõem nada para o componente pai. `defineExpose` permite expor explicitamente métodos, propriedades ou refs para acesso via template refs.

**Use quando:**
- Componente pai precisa chamar métodos do componente filho
- Componente pai precisa acessar propriedades do componente filho
- Criando componentes controláveis (como dialogs, modals, etc)

---

## 🎯 Uso Básico

### Expor Métodos

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

// Expor métodos para o componente pai
defineExpose({
  open,
  close,
  toggle,
})
</script>

<!-- ParentComponent.vue -->
<script setup lang="ts">
import ChildComponent from './ChildComponent.vue'

const childRef = ref<InstanceType<typeof ChildComponent>>()

const handleOpen = () => {
  childRef.value?.open()
}

const handleClose = () => {
  childRef.value?.close()
}
</script>

<template>
  <div>
    <button @click="handleOpen">Abrir</button>
    <button @click="handleClose">Fechar</button>
    <ChildComponent ref="childRef" />
  </div>
</template>
```

### Expor Propriedades

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
const count = ref(0)
const isActive = ref(false)

const increment = () => {
  count.value++
}

// Expor propriedades e métodos
defineExpose({
  count,
  isActive,
  increment,
})
</script>

<!-- ParentComponent.vue -->
<script setup lang="ts">
const childRef = ref<InstanceType<typeof ChildComponent>>()

const checkStatus = () => {
  if (childRef.value?.isActive) {
    console.log('Count:', childRef.value.count)
  }
}
</script>
```

---

## 🎨 Padrões Comuns

### 1. Dialog/Modal Controlável

```vue
<!-- DialogComponent.vue -->
<script setup lang="ts">
const isOpen = ref(false)

const openDialog = () => {
  isOpen.value = true
}

const closeDialog = () => {
  isOpen.value = false
}

defineExpose({
  isOpen,
  openDialog,
  closeDialog,
})
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent>
      <slot />
    </DialogContent>
  </Dialog>
</template>

<!-- Uso -->
<script setup lang="ts">
import DialogComponent from './DialogComponent.vue'

const dialogRef = ref<InstanceType<typeof DialogComponent>>()

const handleOpen = () => {
  dialogRef.value?.openDialog()
}
</script>

<template>
  <button @click="handleOpen">Abrir Dialog</button>
  <DialogComponent ref="dialogRef">
    <p>Conteúdo do dialog</p>
  </DialogComponent>
</template>
```

### 2. Formulário com Métodos de Validação

```vue
<!-- FormComponent.vue -->
<script setup lang="ts">
import { useForm } from 'vee-validate'

const { validate, resetForm, values } = useForm()

const submit = async () => {
  const { valid } = await validate()
  if (valid) {
    // Enviar formulário
  }
}

const reset = () => {
  resetForm()
}

defineExpose({
  submit,
  reset,
  validate,
  values,
})
</script>

<!-- Uso -->
<script setup lang="ts">
const formRef = ref<InstanceType<typeof FormComponent>>()

const handleSubmit = async () => {
  await formRef.value?.submit()
}

const handleReset = () => {
  formRef.value?.reset()
}
</script>

<template>
  <FormComponent ref="formRef" />
  <button @click="handleSubmit">Enviar</button>
  <button @click="handleReset">Resetar</button>
</template>
```

### 3. Componente de Lista com Métodos de Filtro

```vue
<!-- UserList.vue -->
<script setup lang="ts">
const users = ref<User[]>([])
const filteredUsers = ref<User[]>([])

const filterByName = (name: string) => {
  filteredUsers.value = users.value.filter(user =>
    user.name.includes(name)
  )
}

const filterByEmail = (email: string) => {
  filteredUsers.value = users.value.filter(user =>
    user.email.includes(email)
  )
}

const resetFilters = () => {
  filteredUsers.value = users.value
}

defineExpose({
  filterByName,
  filterByEmail,
  resetFilters,
  filteredUsers,
})
</script>

<!-- Uso -->
<script setup lang="ts">
const listRef = ref<InstanceType<typeof UserList>>()

const handleSearch = (searchTerm: string) => {
  listRef.value?.filterByName(searchTerm)
}
</script>
```

### 4. Sidebar com Toggle

```vue
<!-- widgets/sidebar/index.vue -->
<script setup lang="ts">
const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

defineExpose({
  toggleExpand,
  isExpanded,
})
</script>

<template>
  <nav :class="{ expanded: isExpanded }">
    <!-- Conteúdo da sidebar -->
  </nav>
</template>

<!-- Uso -->
<script setup lang="ts">
import Sidebar from '@/widgets/sidebar/index.vue'

const sidebarRef = ref<InstanceType<typeof Sidebar>>()

const toggleSidebar = () => {
  sidebarRef.value?.toggleExpand()
}
</script>

<template>
  <button @click="toggleSidebar">Toggle Sidebar</button>
  <Sidebar ref="sidebarRef" />
</template>
```

---

## 🔒 Tipos com DefineExpose

### Tipagem Explícita

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Exposed {
  open: () => void
  close: () => void
  isOpen: Ref<boolean>
}

const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

defineExpose<Exposed>({
  open,
  close,
  isOpen,
})
</script>

<!-- ParentComponent.vue -->
<script setup lang="ts">
import ChildComponent from './ChildComponent.vue'

const childRef = ref<InstanceType<typeof ChildComponent>>()

// TypeScript conhece os métodos expostos
childRef.value?.open() // ✅ Tipado
childRef.value?.close() // ✅ Tipado
</script>
```

### Usando InstanceType

```vue
<!-- ParentComponent.vue -->
<script setup lang="ts">
import ChildComponent from './ChildComponent.vue'

// InstanceType extrai os tipos expostos automaticamente
const childRef = ref<InstanceType<typeof ChildComponent>>()

// Métodos expostos estão disponíveis e tipados
onMounted(() => {
  childRef.value?.open()
})
</script>
```

---

## ✅ Boas Práticas

### 1. Exponha Apenas o Necessário

```vue
<!-- ✅ CORRETO - Expor apenas métodos públicos -->
defineExpose({
  open,
  close,
})

<!-- ❌ ERRADO - Expor tudo -->
defineExpose({
  open,
  close,
  internalState, // Não deveria ser exposto
  privateMethod, // Não deveria ser exposto
})
```

### 2. Documente o que é Exposto

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
/**
 * Expõe:
 * - open(): void - Abre o componente
 * - close(): void - Fecha o componente
 * - isOpen: Ref<boolean> - Estado de abertura
 */
defineExpose({
  open,
  close,
  isOpen,
})
</script>
```

### 3. Use Tipos para API Clara

```typescript
// ✅ CORRETO - Interface clara
interface DialogExposed {
  open: () => void
  close: () => void
  isOpen: Ref<boolean>
}

defineExpose<DialogExposed>({
  open,
  close,
  isOpen,
})
```

### 4. Verifique se Ref Existe Antes de Usar

```typescript
// ✅ CORRETO - Verificação segura
const handleOpen = () => {
  if (childRef.value) {
    childRef.value.open()
  }
}

// Ou usando optional chaining
const handleOpen = () => {
  childRef.value?.open()
}
```

---

## ❌ Anti-Patterns

### 1. Não Exponha Estado Interno Desnecessário

```vue
<!-- ❌ ERRADO -->
<script setup lang="ts">
const internalCounter = ref(0)
const privateData = ref({})

defineExpose({
  internalCounter, // Não deveria ser exposto
  privateData, // Não deveria ser exposto
})
</script>

<!-- ✅ CORRETO -->
<script setup lang="ts">
const internalCounter = ref(0) // Mantém privado
const privateData = ref({}) // Mantém privado

const publicMethod = () => {
  // Usa estado interno mas não expõe
}

defineExpose({
  publicMethod, // Apenas métodos públicos
})
</script>
```

### 2. Não Use DefineExpose Quando Props/Events São Suficientes

```vue
<!-- ❌ ERRADO - DefineExpose desnecessário -->
<script setup lang="ts">
const value = ref(0)
defineExpose({ value })
</script>

<!-- ✅ CORRETO - Use props e events -->
<script setup lang="ts">
const props = defineProps<{ value: number }>()
const emit = defineEmits<{ 'update:value': [value: number] }>()
</script>
```

### 3. Não Modifique Props Via Expose

```vue
<!-- ❌ ERRADO -->
<script setup lang="ts">
const props = defineProps<{ count: number }>()

const increment = () => {
  props.count++ // ❌ Props são readonly
}

defineExpose({ increment })
</script>

<!-- ✅ CORRETO -->
<script setup lang="ts">
const props = defineProps<{ count: number }>()
const emit = defineEmits<{ 'update:count': [value: number] }>()

const increment = () => {
  emit('update:count', props.count + 1) // ✅ Usa events
}

defineExpose({ increment })
</script>
```

---

## 🔗 Exemplos do Projeto

### Exemplo: Sidebar com Toggle

```vue
<!-- widgets/sidebar/index.vue -->
<script setup lang="ts">
const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

defineExpose({
  toggleExpand,
})
</script>
```

### Exemplo: Dialog de Usuário

```vue
<!-- features/users/handle-users/index.vue -->
<script setup lang="ts">
const isDialogOpen = ref(false)

const handleOpenDialog = () => {
  isDialogOpen.value = true
}

const handleCloseDialog = () => {
  isDialogOpen.value = false
}

defineExpose({
  isDialogOpen,
  handleOpenDialog,
  handleCloseDialog,
})
</script>
```

### Exemplo: Profile Photo Upload

```vue
<!-- features/profile/update-profile/ui/profile-photo/index.vue -->
<script setup lang="ts">
const fileInputRef = ref<HTMLInputElement>()

const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

defineExpose({
  triggerFileSelect,
})
</script>
```

---

## 📚 Recursos Adicionais

- [Vue 3 - defineExpose Documentation](https://vuejs.org/api/sfc-script-setup.html#defineexpose)
- [Vue 3 - Template Refs](https://vuejs.org/guide/essentials/template-refs.html)

---

**Próximo:** Leia [communication.md](./communication.md) para padrões de comunicação entre componentes.
