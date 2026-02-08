# Boas Práticas e Anti-Patterns

Guia completo de boas práticas e anti-patterns para desenvolvimento Vue 3 seguindo FSD.

## ✅ Boas Práticas

### Composição e Organização

#### 1. Composition API com `<script setup>`

**✅ SEMPRE usar:**
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

**❌ NUNCA usar Options API:**
```vue
<script>
export default {
  data() {
    return { count: 0 }
  },
  computed: {
    doubled() {
      return this.count * 2
    }
  }
}
</script>
```

#### 2. Separação de Responsabilidades

**✅ CORRETO - Lógica em composable:**
```typescript
// features/users/list-users/model/useListUsers.ts
export function useListUsers() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })
  
  return { data, isLoading }
}
```

```vue
<!-- features/users/list-users/index.vue -->
<script setup lang="ts">
import { useListUsers } from './model/useListUsers'

const { data, isLoading } = useListUsers()
</script>
```

**❌ ERRADO - Lógica no componente:**
```vue
<script setup lang="ts">
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: getAllUsers,
})
</script>
```

#### 3. Tipagem Completa

**✅ SEMPRE tipar:**
```typescript
import type { User } from '@/shared/api/users-api/types/getAllUsers.types'

const user = ref<User | null>(null)

function handleUser(user: User): void {
  // ...
}
```

**❌ NUNCA usar `any`:**
```typescript
const user: any = ref(null) // ❌
function handleUser(user: any) {} // ❌
```

### Gerenciamento de Estado

#### 4. Vue Query para Estado Servidor

**✅ CORRETO:**
```typescript
const { data, isLoading, refetch } = useQuery({
  queryKey: ['users', filters],
  queryFn: () => getAllUsers(filters.value),
})
```

**❌ ERRADO - Store para dados servidor:**
```typescript
// ❌ Não fazer isso
const usersStore = defineStore('users', {
  state: () => ({ users: [] }),
  actions: {
    async fetchUsers() {
      this.users = await getAllUsers()
    }
  }
})
```

#### 5. Pinia Apenas para Estado Cliente Global

**✅ CORRETO - Estado global:**
```typescript
// shared/store/theme.ts
export const useThemeStore = defineStore('theme', {
  state: () => ({ isDark: false }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
    }
  }
})
```

**❌ ERRADO - Estado local em store:**
```typescript
// ❌ Estado local não precisa de store
const dialogStore = defineStore('dialog', {
  state: () => ({ isOpen: false })
})
```

#### 6. Estado Local com `ref`

**✅ CORRETO:**
```vue
<script setup lang="ts">
const isDialogOpen = ref(false)

const handleOpen = () => {
  isDialogOpen.value = true
}
</script>
```

### APIs e Data Fetching

#### 7. Uma Função por Arquivo de API

**✅ CORRETO:**
```typescript
// shared/api/users-api/getAllUsers.ts
export async function getAllUsers(params: Params): Promise<Response> {
  const response = await axiosClient.request<Response>({
    endpoint: 'users',
    method: 'GET',
    params,
  })
  return response.data
}
```

**❌ ERRADO - Múltiplas funções:**
```typescript
// ❌ Não fazer
export async function getAllUsers() {}
export async function getUserById() {}
export async function createUser() {}
```

#### 8. Tipos Sempre Separados

**✅ CORRETO:**
```typescript
// shared/api/users-api/types/getAllUsers.types.ts
export interface Params {
  page: number
  perPage: number
}

export interface Response {
  users: User[]
  pagination: Pagination
}
```

**❌ ERRADO - Tipos inline:**
```typescript
// ❌ Não fazer
export async function getAllUsers(params: { page: number }) {
  // ...
}
```

#### 9. Error Handling em Composables

**✅ CORRETO:**
```typescript
const postLogin = () => {
  const { mutate } = useMutation({
    mutationFn: (payload: Payload) =>
      postLoginService(payload).catch((error) => {
        toast.error(error?.response?.data?.message || 'Erro desconhecido.')
        throw error
      }),
  })
  
  return { mutate }
}
```

**❌ ERRADO - Sem tratamento:**
```typescript
// ❌ Não fazer
const postLogin = () => {
  const { mutate } = useMutation({
    mutationFn: postLoginService, // Sem tratamento de erro
  })
}
```

### Validação

#### 10. Zod Schemas com Tipos Derivados

**Referência:** `.cursor/skills/vue3-forms-validation/validation-schemas.md`

**Regra:** Usar `toTypedSchema` + `z.infer<typeof schema>` para tipos derivados. Nunca duplicar tipos em interface separada.

### Componentes

#### 11. Props Tipadas

**✅ CORRETO:**
```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = defineProps<Props>()
</script>
```

**❌ ERRADO - Props sem tipo:**
```vue
<script setup>
const props = defineProps(['title', 'count']) // ❌
</script>
```

#### 12. Exposição Explícita

**✅ CORRETO:**
```vue
<script setup lang="ts">
const isOpen = ref(false)

const handleOpenDialog = () => {
  isOpen.value = true
}

defineExpose({
  handleOpenDialog,
})
</script>
```

**❌ ERRADO - Exposição implícita:**
```vue
<script setup>
// ❌ Não expor métodos necessários
const isOpen = ref(false)
</script>
```

### Estilização

#### 13. Usar `cn()` para Classes Condicionais

**✅ CORRETO:**
```vue
<script setup lang="ts">
import { cn } from '@/app/utils/cn'

const buttonClass = computed(() =>
  cn(
    'base-button',
    isActive.value && 'active',
    isDisabled.value && 'disabled'
  )
)
</script>
```

**❌ ERRADO - Classes inline:**
```vue
<template>
  <button :class="`base-button ${isActive ? 'active' : ''}`">
    <!-- ❌ -->
  </button>
</template>
```

### Imports

#### 14. Ordenação de Imports

**✅ CORRETO:**
```typescript
// 1. Externos
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

// 2. Internos
import { postLogin as postLoginService } from '@/shared/api/auth-api/postLogin'

// 3. Tipos
import type { Payload } from '@/shared/api/auth-api/types/postLogin.types'
```

**❌ ERRADO - Imports desorganizados:**
```typescript
import type { Payload } from '@/shared/api/auth-api/types/postLogin.types'
import { toast } from 'vue-sonner'
import { postLogin as postLoginService } from '@/shared/api/auth-api/postLogin'
import { useMutation } from '@tanstack/vue-query'
```

## ❌ Anti-Patterns

### Arquitetura

#### 1. Violação de Dependências

**❌ ERRADO:**
```typescript
// features/users/handle-users/model/useHandleUsers.ts
import { UsersView } from '@/pages/users/UsersView.vue' // ❌
```

**✅ CORRETO:**
```typescript
// features/users/handle-users/model/useHandleUsers.ts
// Não importar de pages/
```

#### 2. Lógica de Negócio em Pages

**❌ ERRADO:**
```vue
<!-- pages/users/UsersView.vue -->
<script setup>
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    // Lógica de negócio aqui ❌
    const response = await axios.get('/users')
    return response.data.map(user => ({
      ...user,
      displayName: `${user.firstName} ${user.lastName}`
    }))
  }
})
</script>
```

**✅ CORRETO:**
```vue
<!-- pages/users/UsersView.vue -->
<script setup>
import { useListUsers } from '@/features/users/list-users/model/useListUsers'

const { data } = useListUsers() // Lógica em feature ✅
</script>
```

#### 3. Componentes Reutilizáveis em Features

**❌ ERRADO:**
```vue
<!-- features/users/handle-users/ui/Button.vue -->
<!-- Button genérico não deve estar em feature ❌ -->
```

**✅ CORRETO:**
```vue
<!-- shared/ui/Button.vue ou widgets/button/index.vue -->
<!-- Componente genérico em shared ou widget ✅ -->
```

### Performance

#### 4. Renderização Desnecessária

**❌ ERRADO:**
```vue
<template>
  <div v-for="item in items" :key="item.id">
    <ExpensiveComponent :data="item" />
  </div>
</template>
```

**✅ CORRETO:**
```vue
<template>
  <div v-for="item in items" :key="item.id">
    <ExpensiveComponent 
      v-if="shouldRender(item)"
      :data="item" 
    />
  </div>
</template>
```

#### 5. Watchers Desnecessários

**❌ ERRADO:**
```typescript
const count = ref(0)
const doubled = ref(0)

watch(count, (newVal) => {
  doubled.value = newVal * 2 // ❌ Use computed
})
```

**✅ CORRETO:**
```typescript
const count = ref(0)
const doubled = computed(() => count.value * 2) // ✅
```

### Estado

#### 6. Mutação Direta de Props

**❌ ERRADO:**
```vue
<script setup lang="ts">
const props = defineProps<{ count: number }>()

const increment = () => {
  props.count++ // ❌ Props são readonly
}
</script>
```

**✅ CORRETO:**
```vue
<script setup lang="ts">
const props = defineProps<{ count: number }>()

const emit = defineEmits<{
  'update:count': [value: number]
}>()

const increment = () => {
  emit('update:count', props.count + 1) // ✅
}
</script>
```

#### 7. Estado Global Desnecessário

**❌ ERRADO:**
```typescript
// Store para estado local
const dialogStore = defineStore('dialog', {
  state: () => ({ isOpen: false })
})
```

**✅ CORRETO:**
```typescript
// Estado local com ref
const isOpen = ref(false) // ✅
```

### APIs

#### 8. Hardcode de URLs

**❌ ERRADO:**
```typescript
const response = await axios.get('https://api.example.com/users') // ❌
```

**✅ CORRETO:**
```typescript
const response = await axiosClient.request({
  endpoint: 'users', // ✅ Usa baseURL do config
  method: 'GET',
})
```

#### 9. Sem Tratamento de Erro

**❌ ERRADO:**
```typescript
const { mutate } = useMutation({
  mutationFn: postLoginService, // ❌ Sem tratamento
})
```

**✅ CORRETO:**
```typescript
const { mutate } = useMutation({
  mutationFn: (payload: Payload) =>
    postLoginService(payload).catch((error) => {
      toast.error(error?.response?.data?.message || 'Erro desconhecido.')
      throw error
    }),
})
```

### TypeScript

#### 10. Uso de `any`

**❌ ERRADO:**
```typescript
function handleData(data: any) { // ❌
  // ...
}
```

**✅ CORRETO:**
```typescript
function handleData(data: User) { // ✅
  // ...
}
```

#### 11. Tipos Inline Complexos

**❌ ERRADO:**
```typescript
function processUsers(
  users: Array<{ id: number; name: string; email: string }>
) { // ❌
  // ...
}
```

**✅ CORRETO:**
```typescript
import type { User } from '@/shared/api/users-api/types/getAllUsers.types'

function processUsers(users: User[]) { // ✅
  // ...
}
```

## Checklist de Qualidade

Antes de finalizar uma feature, verifique:

### Arquitetura
- [ ] Respeita hierarquia de dependências FSD
- [ ] Lógica de negócio em `model/`
- [ ] UI específica em `ui/`
- [ ] Não importa de camadas superiores

### Código
- [ ] Usa Composition API com `<script setup>`
- [ ] Tudo tipado com TypeScript (sem `any`)
- [ ] Tipos em arquivos separados
- [ ] Error handling implementado
- [ ] Imports organizados

### Performance
- [ ] Rotas com lazy loading
- [ ] Features pesadas com `defineAsyncComponent`
- [ ] Usa `computed` para valores derivados
- [ ] Evita watchers desnecessários

### Testes
- [ ] Testes junto com o código em `__tests__/`
- [ ] Cobre casos principais e edge cases
