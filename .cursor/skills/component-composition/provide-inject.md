# Provide/Inject

Guia completo sobre provide/inject em Vue 3 para compartilhamento de contexto entre componentes aninhados.

## 📋 O que é Provide/Inject?

Provide/Inject permite que componentes ancestrais forneçam dependências para todos os componentes descendentes, independentemente da profundidade da hierarquia.

**Use quando:**
- Compartilhar configuração/contexto global
- Evitar "prop drilling" (passar props por muitos níveis)
- Compartilhar estado ou funcionalidades entre componentes distantes

---

## 🎯 Uso Básico

### Provide (Fornecer)

```vue
<!-- Componente Ancestral -->
<script setup lang="ts">
import { provide } from 'vue'

// Fornecer um valor simples
provide('theme', 'dark')

// Fornecer um valor reativo
const theme = ref('dark')
provide('theme', theme)

// Fornecer um objeto
provide('config', {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
})
</script>
```

### Inject (Injetar)

```vue
<!-- Componente Descendente (qualquer nível) -->
<script setup lang="ts">
import { inject } from 'vue'

// Injetar com valor padrão
const theme = inject('theme', 'light')

// Injetar sem valor padrão (pode ser undefined)
const theme = inject('theme')

// Injetar com tipo
const theme = inject<string>('theme', 'light')
</script>
```

---

## 🔄 Valores Reativos

### Provide Reativo

```vue
<!-- App.vue -->
<script setup lang="ts">
import { provide, ref } from 'vue'

const user = ref({
  id: 1,
  name: 'João',
  email: 'joao@example.com',
})

// Fornecer o ref diretamente (mantém reatividade)
provide('user', user)

// Ou fornecer apenas o valor (perde reatividade)
provide('user', user.value) // ❌ Não reativo
</script>
```

### Inject Reativo

```vue
<!-- Componente Filho -->
<script setup lang="ts">
import { inject } from 'vue'

// Injetar o ref (mantém reatividade)
const user = inject<Ref<User>>('user')

// Acessar valor
console.log(user?.value.name) // 'João'

// Modificar valor (se o provide foi um ref)
user.value.name = 'Maria' // Atualiza em todos os componentes
</script>
```

---

## 🎨 Padrões Comuns

### 1. Tema/Configuração Global

```vue
<!-- app/providers/theme/index.ts -->
<script setup lang="ts">
import { provide, ref } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

provide('theme', theme)
provide('toggleTheme', toggleTheme)
</script>

<!-- Qualquer componente descendente -->
<script setup lang="ts">
const theme = inject<Ref<Theme>>('theme', ref('light'))
const toggleTheme = inject<() => void>('toggleTheme', () => {})

const isDark = computed(() => theme.value === 'dark')
</script>

<template>
  <div :class="{ dark: isDark }">
    <button @click="toggleTheme">Toggle Theme</button>
  </div>
</template>
```

### 2. Autenticação/Usuário

```vue
<!-- app/providers/auth/index.ts -->
<script setup lang="ts">
import { provide, ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const user = ref<User | null>(null)
const isAuthenticated = computed(() => user.value !== null)

const login = (userData: User) => {
  user.value = userData
}

const logout = () => {
  user.value = null
}

provide('user', user)
provide('isAuthenticated', isAuthenticated)
provide('login', login)
provide('logout', logout)
</script>

<!-- Componente que precisa do usuário -->
<script setup lang="ts">
const user = inject<Ref<User | null>>('user', ref(null))
const isAuthenticated = inject<ComputedRef<boolean>>('isAuthenticated', computed(() => false))
const logout = inject<() => void>('logout', () => {})
</script>
```

### 3. Form Context (VeeValidate)

```vue
<!-- FormProvider.vue -->
<script setup lang="ts">
import { provide } from 'vue'
import { useForm } from 'vee-validate'

const { values, errors, handleSubmit } = useForm()

provide('formValues', values)
provide('formErrors', errors)
provide('formSubmit', handleSubmit)
</script>

<!-- FormField.vue -->
<script setup lang="ts">
import { inject } from 'vue'

const formErrors = inject('formErrors')
const fieldName = 'email'

const fieldError = computed(() => formErrors?.value[fieldName])
</script>
```

### 4. API Client/Configuração

```vue
<!-- app/providers/api/index.ts -->
<script setup lang="ts">
import { provide } from 'vue'
import { axiosClient } from '@/shared/api/config/axios-client'

provide('apiClient', axiosClient)
</script>

<!-- Componente que precisa fazer requisições -->
<script setup lang="ts">
const apiClient = inject('apiClient')

const fetchData = async () => {
  const response = await apiClient.request({
    endpoint: 'users',
    method: 'GET',
  })
  return response
}
</script>
```

---

## 🔒 Tipos com Provide/Inject

### Tipagem Explícita

```vue
<!-- Provider -->
<script setup lang="ts">
import { provide, ref } from 'vue'

interface Config {
  apiUrl: string
  timeout: number
}

const config = ref<Config>({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
})

provide<Ref<Config>>('config', config)
</script>

<!-- Consumer -->
<script setup lang="ts">
import { inject, type Ref } from 'vue'

interface Config {
  apiUrl: string
  timeout: number
}

const config = inject<Ref<Config>>('config')

if (config) {
  console.log(config.value.apiUrl)
}
</script>
```

### Symbol Keys (Recomendado)

Usar Symbols para keys evita conflitos de nomes:

```vue
<!-- shared/constants/injection-keys.ts -->
export const THEME_KEY = Symbol('theme')
export const USER_KEY = Symbol('user')
export const API_CLIENT_KEY = Symbol('apiClient')

<!-- Provider -->
<script setup lang="ts">
import { provide, ref } from 'vue'
import { THEME_KEY } from '@/shared/constants/injection-keys'

const theme = ref('dark')
provide(THEME_KEY, theme)
</script>

<!-- Consumer -->
<script setup lang="ts">
import { inject } from 'vue'
import { THEME_KEY } from '@/shared/constants/injection-keys'

const theme = inject<Ref<string>>(THEME_KEY, ref('light'))
</script>
```

---

## ✅ Boas Práticas

### 1. Use Symbols para Keys

```typescript
// ✅ CORRETO
export const THEME_KEY = Symbol('theme')
provide(THEME_KEY, theme)

// ❌ ERRADO - Pode causar conflitos
provide('theme', theme)
```

### 2. Forneça Valores Padrão

```typescript
// ✅ CORRETO
const theme = inject<Ref<Theme>>(THEME_KEY, ref('light'))

// ❌ ERRADO - Pode ser undefined
const theme = inject<Ref<Theme>>(THEME_KEY)
```

### 3. Use Provide/Inject Apenas Quando Necessário

```vue
<!-- ✅ CORRETO - Muitos níveis -->
<App>
  <Layout>
    <Page>
      <Component>
        <!-- Precisa do tema -->
      </Component>
    </Page>
  </Layout>
</App>

<!-- ❌ ERRADO - Apenas 1 nível -->
<Parent>
  <Child />
  <!-- Props são suficientes -->
</Parent>
```

### 4. Documente o que é Fornecido

```vue
<!-- Provider -->
<script setup lang="ts">
/**
 * Fornece:
 * - theme: Ref<Theme> - Tema atual ('light' | 'dark')
 * - toggleTheme: () => void - Função para alternar tema
 */
provide(THEME_KEY, theme)
provide(TOGGLE_THEME_KEY, toggleTheme)
</script>
```

---

## ❌ Anti-Patterns

### 1. Não Use Provide/Inject para Props Simples

```vue
<!-- ❌ ERRADO - Props são suficientes -->
<Parent>
  <Child />
</Parent>

<!-- ✅ CORRETO - Use props -->
<Parent>
  <Child :data="data" />
</Parent>
```

### 2. Não Modifique Valores Injetados Sem Cuidado

```typescript
// ❌ ERRADO - Modificar diretamente pode causar efeitos colaterais
const user = inject('user')
user.value.name = 'Novo Nome' // Pode afetar outros componentes

// ✅ CORRETO - Use métodos fornecidos
const updateUser = inject('updateUser')
updateUser({ name: 'Novo Nome' })
```

### 3. Não Use Provide/Inject para Estado Local

```vue
<!-- ❌ ERRADO - Estado local não precisa de provide/inject -->
<script setup lang="ts">
const localState = ref(0)
provide('localState', localState) // Desnecessário
</script>

<!-- ✅ CORRETO - Use ref local -->
<script setup lang="ts">
const localState = ref(0)
</script>
```

---

## 🔗 Exemplos do Projeto

### Exemplo: Configuração de API

```typescript
// shared/api/config/api-provider.ts
import { provide } from 'vue'
import { axiosClient } from './axios-client'

export const API_CLIENT_KEY = Symbol('apiClient')

export function provideApiClient() {
  provide(API_CLIENT_KEY, axiosClient)
}
```

### Exemplo: Contexto de Formulário

```vue
<!-- features/users/handle-users/index.vue -->
<script setup lang="ts">
import { provide } from 'vue'
import { useForm } from 'vee-validate'

const { values, errors, handleSubmit } = useForm()

provide('formContext', {
  values,
  errors,
  handleSubmit,
})
</script>
```

---

## 📚 Recursos Adicionais

- [Vue 3 - Provide/Inject Documentation](https://vuejs.org/guide/components/provide-inject.html)
- [VueUse - createInjectionState](https://vueuse.org/core/createInjectionState/) - Helper para criar provide/inject tipado

---

**Próximo:** Leia [expose.md](./expose.md) para expor métodos e propriedades de componentes filhos.
