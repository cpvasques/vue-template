# Padrões de Código

Padrões específicos e templates para desenvolvimento Vue 3 seguindo FSD.

## Template de Feature Completa

### Estrutura Completa

```
features/[feature-name]/
├── index.vue
├── model/
│   ├── [feature]Schema.ts
│   └── use[Feature].ts
├── ui/
│   └── [component]/
│       ├── index.vue
│       └── __tests__/
└── store/ (opcional)
    └── [feature].ts
```

### Template: Schema Zod

**Referência:** `.cursor/skills/vue3-forms-validation/validation-schemas.md`

Usar `toTypedSchema` com Zod. Exportar tipo com `z.infer<typeof schema>`.

### Template: Composable com Vue Query

```typescript
// features/[feature-name]/model/use[Feature].ts
import { useQuery, useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { [action][Feature] as [action][Feature]Service } from '@/shared/api/[domain]-api/[action][Feature]'
import type { Payload, Response } from '@/shared/api/[domain]-api/types/[action][Feature].types'

const [action][Feature] = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: Payload) =>
      [action][Feature]Service(payload).catch((error) => {
        toast.error(error?.response?.data?.message || 'Erro desconhecido.')
        throw error
      }),
  })

  return { isPending, isError, error, isSuccess, mutate }
}

const get[Feature] = () => {
  const filters = ref({})
  
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['get[Feature]', filters],
    queryFn: () => [action][Feature]Service(filters.value),
  })

  return { data, isLoading, isFetching, filters, refetch }
}

export function use[Feature]() {
  return {
    [action][Feature],
    get[Feature],
  }
}
```

### Template: Componente de Feature

```vue
<!-- features/[feature-name]/index.vue -->
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { [feature]Schema, type [Feature]FormData } from './model/[feature]Schema'
import { use[Feature] } from './model/use[Feature]'

const { [action][Feature] } = use[Feature]()
const { mutate, isPending } = [action][Feature]()

const { handleSubmit, resetForm } = useForm<[Feature]FormData>({
  validationSchema: toTypedSchema([feature]Schema),
})

const onSubmit = handleSubmit((values) => {
  mutate(values, {
    onSuccess: () => {
      resetForm()
    },
  })
})
</script>

<template>
  <Dialog>
    <form @submit="onSubmit">
      <!-- Form fields -->
      <Button type="submit" :disabled="isPending">
        Salvar
      </Button>
    </form>
  </Dialog>
</template>
```

## Template de API

**Referência:** `.cursor/rules/api-development.md` — estrutura, nomenclatura, tipos, error handling.

## Template de Widget

```vue
<!-- widgets/[widget-name]/index.vue -->
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

const emit = defineEmits<{
  'update:count': [value: number]
  'action': [data: unknown]
}>()

const handleAction = () => {
  emit('action', {})
}
</script>

<template>
  <div class="widget-container">
    <h2>{{ title }}</h2>
    <slot name="content" />
    <slot name="actions" />
  </div>
</template>
```

## Template de Page

```vue
<!-- pages/[page-name]/[Page]View.vue -->
<script setup lang="ts">
import [Feature]Dialog from '@/features/[feature-name]/index.vue'
import [Feature]Table from '@/features/[feature-name]/list/index.vue'
import { use[Feature] } from '@/features/[feature-name]/model/use[Feature]'
import PageTitle from '@/widgets/page-title/index.vue'

const { get[Feature] } = use[Feature]()
const { data, isLoading, currentPage } = get[Feature]()

const [feature]DialogRef = ref<InstanceType<typeof [Feature]Dialog> | null>(null)

const handleToggleDialog = () => {
  [feature]DialogRef.value?.handleOpenDialog()
}
</script>

<template>
  <section class="page-container">
    <PageTitle title="[Page Title]">
      <template #actions>
        <Button @click="handleToggleDialog">
          Novo [Resource]
        </Button>
      </template>
    </PageTitle>
    
    <[Feature]Table 
      :data="data" 
      :current-page="currentPage"
      :is-loading="isLoading"
    />
    
    <[Feature]Dialog ref="[feature]DialogRef" />
  </section>
</template>
```

## Template de Store Pinia

```typescript
// features/[feature-name]/store/[feature].ts
// OU shared/store/[feature].ts (se global)
import { defineStore } from 'pinia'

interface State {
  field1: string
  field2: number
}

export const use[Feature]Store = defineStore('[feature]', {
  state: (): State => ({
    field1: '',
    field2: 0,
  }),
  
  getters: {
    computedField: (state) => {
      return `${state.field1} - ${state.field2}`
    },
  },
  
  actions: {
    setField1(value: string) {
      this.field1 = value
    },
    
    reset() {
      this.$reset()
    },
  },
  
  persist: {
    storage: sessionStorage, // ou localStorage
  },
})
```

## Padrão de Listagem com Paginação

```typescript
// features/[feature-name]/model/useList[Feature].ts
import { useQuery } from '@tanstack/vue-query'
import { pickBy } from 'lodash'
import { toast } from 'vue-sonner'
import { getAll[Feature] as getAll[Feature]Service } from '@/shared/api/[domain]-api/getAll[Feature]'

const getAll[Feature] = () => {
  const currentPage = ref(1)
  const perPage = ref(10)
  const filters = ref({})

  const params = computed(() => ({
    page: currentPage.value,
    perPage: perPage.value,
    ...pickBy(filters.value),
  }))

  const { isPending, data, error, isFetching, isLoading, refetch } = useQuery({
    queryKey: ['getAll[Feature]', currentPage, perPage, filters],
    queryFn: () =>
      getAll[Feature]Service(params.value).catch((error) =>
        toast.error(error?.response?.data?.message || 'Erro desconhecido.'),
      ),
  })

  return {
    isPending,
    isFetching,
    isLoading,
    data,
    error,
    currentPage,
    perPage,
    filters,
    refetch,
  }
}

export function useList[Feature]() {
  return {
    getAll[Feature],
  }
}
```

## Padrão de Dialog/Modal

```vue
<!-- features/[feature-name]/index.vue -->
<script setup lang="ts">
const isOpen = ref(false)
const editingItem = ref<Item | null>(null)

const handleOpenDialog = (item?: Item) => {
  editingItem.value = item || null
  isOpen.value = true
}

const handleCloseDialog = () => {
  isOpen.value = false
  editingItem.value = null
}

defineExpose({
  handleOpenDialog,
})
</script>

<template>
  <Dialog :open="isOpen" @update:open="handleCloseDialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ editingItem ? 'Editar' : 'Novo' }} [Resource]
        </DialogTitle>
      </DialogHeader>
      
      <!-- Form content -->
      
      <DialogFooter>
        <Button variant="outline" @click="handleCloseDialog">
          Cancelar
        </Button>
        <Button @click="handleSubmit">
          Salvar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

## Padrão de Formulário com VeeValidate

**Referência:** `.cursor/skills/vue3-forms-validation/form-patterns.md` e `templates.md`

Usar `FormField` + `componentField` com DS. Não usar `defineField` com inputs HTML nativos — prefira componentes do DS conforme form-patterns.

## Padrão de Tabela com Ordenação

```vue
<!-- features/[feature-name]/list/index.vue -->
<script setup lang="ts">
interface Props {
  data: Item[]
  currentPage: number
  total: number
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const emit = defineEmits<{
  'handle-order-by': [key: string, direction: string]
  'handle-edit': [item: Item]
  'handle-delete': [item: Item]
  'handle-page': [page: number]
  'handle-next-page': []
  'handle-prev-page': []
}>()

const sortKey = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
  
  emit('handle-order-by', key, sortDirection.value)
}
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th @click="handleSort('name')">
            Nome
            <span v-if="sortKey === 'name'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <!-- More columns -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td>{{ item.name }}</td>
          <td>
            <Button @click="emit('handle-edit', item)">Editar</Button>
            <Button @click="emit('handle-delete', item)">Excluir</Button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <Pagination
      :current-page="currentPage"
      :total="total"
      @handle-page="emit('handle-page', $event)"
      @handle-next-page="emit('handle-next-page')"
      @handle-prev-page="emit('handle-prev-page')"
    />
  </div>
</template>
```

## Convenções de Nomenclatura

### Arquivos
- **Componentes**: PascalCase (`LoginView.vue`, `UserDialog.vue`)
- **Composables**: camelCase com `use` (`useLogin.ts`, `useListUsers.ts`)
- **Stores**: camelCase com `use` (`useAuthStore.ts`)
- **APIs**: camelCase com verbo (`postLogin.ts`, `getAllUsers.ts`)
- **Schemas**: camelCase com `Schema` (`loginSchema.ts`)
- **Tipos**: PascalCase (`Payload`, `Response`, `User`)

### Diretórios
- **Features**: kebab-case (`login-auth/`, `handle-users/`)
- **Pages**: kebab-case (`login/`, `users/`)
- **Widgets**: kebab-case (`page-title/`, `data-table/`)

### Variáveis e Funções
- **Variáveis**: camelCase (`currentPage`, `isLoading`)
- **Funções**: camelCase (`handleSubmit`, `getAllUsers`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Props e Emits
- **Props**: camelCase (`currentPage`, `isLoading`)
- **Emits**: kebab-case (`handle-order-by`, `update:count`)
