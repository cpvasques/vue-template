# Performance e Otimização

Guia completo de otimizações de performance, lazy loading e code splitting para Vue 3.

## Lazy Loading Obrigatório

### Rotas com Dynamic Imports

**✅ SEMPRE usar:**
```typescript
// app/providers/router/index.ts
export const routes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/pages/users/UsersView.vue'), // ✅ Lazy
  },
]
```

**❌ NUNCA usar:**
```typescript
import UsersView from '@/pages/users/UsersView.vue' // ❌ Eager

export const routes: RouteRecordRaw[] = [
  {
    path: '/users',
    component: UsersView, // ❌ Carrega tudo no bundle inicial
  },
]
```

### Features Pesadas

**✅ CORRETO - Async Component:**
```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeavyFeature = defineAsyncComponent(() =>
  import('@/features/heavy-feature/index.vue')
)
</script>

<template>
  <HeavyFeature v-if="shouldLoad" />
</template>
```

**✅ CORRETO - Conditional Import:**
```vue
<script setup lang="ts">
const loadHeavyFeature = async () => {
  const { default: HeavyFeature } = await import('@/features/heavy-feature/index.vue')
  // Usar componente
}
</script>
```

### Bibliotecas Grandes

**✅ CORRETO - Dynamic Import:**
```typescript
const loadChart = async () => {
  const { Chart } = await import('chart.js')
  // Usar Chart
}
```

**❌ ERRADO - Import estático:**
```typescript
import { Chart } from 'chart.js' // ❌ Carrega no bundle inicial
```

### Mocks Condicionais

**✅ CORRETO:**
```typescript
// app/main.ts
if (import.meta.env.VITE_ENABLE_MOCK_SERVER === 'true') {
  const { worker } = await import('../shared/mocks/browser.ts')
  worker.start()
}
```

## Code Splitting

### Estratégias de Splitting

#### 1. Route-Based Splitting (Padrão)

Cada rota gera um chunk separado automaticamente:

```typescript
// Vite cria chunks automaticamente:
// - users.chunk.js
// - profile.chunk.js
// - login.chunk.js
```

#### 2. Feature-Based Splitting

Para features muito grandes:

```typescript
// app/providers/router/index.ts
{
  path: '/admin',
  component: () => import(
    /* webpackChunkName: "admin" */ 
    '@/pages/admin/AdminView.vue'
  ),
}
```

#### 3. Component-Based Splitting

Para componentes pesados:

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { TableLoader } from '@/shared/components/table-loader'

const DataTable = defineAsyncComponent({
  loader: () => import('@/shared/components/data-table/data-table.vue'),
  loadingComponent: TableLoader,
  errorComponent: TableError,
  delay: 200,
  timeout: 3000,
})
</script>
```

### Configuração Vite

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-query': ['@tanstack/vue-query'],
          'vendor-ui': ['reka-ui'],
        },
      },
    },
  },
})
```

## Vue Query Performance

### Configuração Otimizada

```typescript
// app/plugins/vueQuery.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (antigo cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

### Query Keys Reativas

**✅ CORRETO - Query key reativa:**
```typescript
const currentPage = ref(1)
const filters = ref({})

const { data } = useQuery({
  queryKey: ['users', currentPage, filters], // ✅ Reativa
  queryFn: () => getAllUsers({
    page: currentPage.value,
    ...filters.value,
  }),
})
```

**❌ ERRADO - Query key estática:**
```typescript
const { data } = useQuery({
  queryKey: ['users'], // ❌ Não atualiza quando filters mudam
  queryFn: () => getAllUsers(filters.value),
})
```

### Paginação Eficiente

```typescript
const getAllUsers = () => {
  const currentPage = ref(1)
  const perPage = ref(10)
  const filters = ref({})

  const params = computed(() => ({
    page: currentPage.value,
    perPage: perPage.value,
    ...pickBy(filters.value),
  }))

  const { data, isLoading } = useQuery({
    queryKey: ['getAllUsers', params], // ✅ Invalida quando params mudam
    queryFn: () => getAllUsersService(params.value),
  })

  return {
    data,
    isLoading,
    currentPage,
    perPage,
    filters,
  }
}
```

### Prefetching

```typescript
const queryClient = useQueryClient()

const prefetchUser = (userId: number) => {
  queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
  })
}
```

## Renderização Otimizada

### v-if vs v-show

**✅ Use `v-if` para:**
- Componentes pesados
- Renderização condicional rara
- Quando não precisa manter estado

```vue
<template>
  <HeavyComponent v-if="isVisible" /> <!-- ✅ -->
</template>
```

**✅ Use `v-show` para:**
- Toggle frequente
- Quando precisa manter estado
- Componentes leves

```vue
<template>
  <div v-show="isMenuOpen"> <!-- ✅ Toggle frequente -->
    Menu content
  </div>
</template>
```

### v-for Otimizado

**✅ CORRETO - Key estável:**
```vue
<template>
  <div v-for="user in users" :key="user.id">
    {{ user.name }}
  </div>
</template>
```

**❌ ERRADO - Key instável:**
```vue
<template>
  <div v-for="(user, index) in users" :key="index"> <!-- ❌ -->
    {{ user.name }}
  </div>
</template>
```

### Computed vs Methods

**✅ CORRETO - Computed para valores derivados:**
```typescript
const filteredUsers = computed(() => {
  return users.value.filter(user => 
    user.name.includes(searchTerm.value)
  )
})
```

**❌ ERRADO - Method em template:**
```vue
<template>
  <div v-for="user in filterUsers()"> <!-- ❌ Recalcula sempre -->
    {{ user.name }}
  </div>
</template>
```

### Memoização com `computed`

```typescript
const expensiveComputation = computed(() => {
  // Cálculo pesado
  return heavyData.value.reduce((acc, item) => {
    // Processamento complexo
    return acc + processItem(item)
  }, 0)
})
```

## Otimização de Componentes

### `defineAsyncComponent` com Loading States

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { TableLoader } from '@/shared/components/table-loader'

const DataTable = defineAsyncComponent({
  loader: () => import('@/widgets/data-table/index.vue'),
  loadingComponent: TableLoader,
  delay: 200,
  timeout: 3000,
})
</script>

<template>
  <Suspense>
    <DataTable />
    <template #fallback>
      <TableLoader />
    </template>
  </Suspense>
</template>
```

### `shallowRef` para Objetos Grandes

**✅ CORRETO:**
```typescript
import { shallowRef } from 'vue'

const largeData = shallowRef({ /* objeto grande */ })
// Não cria proxies profundos, melhor performance
```

### `markRaw` para Objetos Não Reativos

```typescript
import { markRaw } from 'vue'

const chartInstance = markRaw(new Chart(...))
// Não torna reativo, melhor performance
```

## Otimização de Imagens

### Lazy Loading de Imagens

```vue
<template>
  <img 
    v-lazy="imageUrl" 
    alt="Description"
    loading="lazy"
  />
</template>
```

### Responsive Images

```vue
<template>
  <img
    :srcset="`
      ${imageSmall} 480w,
      ${imageMedium} 768w,
      ${imageLarge} 1200w
    `"
    sizes="(max-width: 768px) 480px, (max-width: 1200px) 768px, 1200px"
    :src="imageMedium"
    alt="Description"
  />
</template>
```

## Bundle Analysis

### Analisar Bundle Size

```bash
npm run build
npx vite-bundle-visualizer
```

### Identificar Chunks Grandes

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) {
              return 'vendor-vue'
            }
            if (id.includes('@tanstack')) {
              return 'vendor-query'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
```

## Métricas de Performance

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Monitoramento

```typescript
// app/main.ts
if (import.meta.env.PROD) {
  import('web-vitals').then(({ onCLS, onFID, onLCP }) => {
    onCLS(console.log)
    onFID(console.log)
    onLCP(console.log)
  })
}
```

## Checklist de Performance

Antes de fazer deploy, verifique:

- [ ] Todas as rotas usam dynamic imports
- [ ] Features pesadas usam `defineAsyncComponent`
- [ ] Bibliotecas grandes são importadas dinamicamente
- [ ] Vue Query configurado com `staleTime` e `gcTime`
- [ ] Query keys são reativas
- [ ] `v-if` usado para componentes pesados
- [ ] `v-show` usado para toggle frequente
- [ ] `computed` usado para valores derivados
- [ ] Keys estáveis em `v-for`
- [ ] Imagens com lazy loading
- [ ] Bundle size analisado e otimizado
