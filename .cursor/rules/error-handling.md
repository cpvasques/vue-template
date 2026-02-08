---
description: Padrões de tratamento de erros, logging e feedback ao usuário
globs: ['**/features/**/model/use*.ts', '**/shared/api/**']
alwaysApply: true
---

# Error Handling & Logging

Diretrizes para tratamento de erros, logging e feedback ao usuário no projeto Vue 3 FSD.

## Quando Usar Esta Rule

Esta rule deve ser aplicada quando:
- Criando composables com Vue Query
- Implementando chamadas de API
- Tratando erros de validação
- Implementando feedback ao usuário
- Configurando logging para debugging

---

## Padrões de Error Handling em Composables

### Padrão com Vue Query

**✅ CORRETO - Tratamento com toast:**
```typescript
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { postLogin as postLoginService } from '@/shared/api/auth-api/postLogin'
import type { Payload } from '@/shared/api/auth-api/types/postLogin.types'

const postLogin = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: Payload) =>
      postLoginService(payload).catch((error) => {
        toast.error(error?.response?.data?.message || 'Erro desconhecido.')
        throw error // Re-throw para Vue Query
      }),
  })

  return { isPending, isError, error, isSuccess, mutate }
}
```

**Componentes do padrão:**
1. `.catch()` para capturar erros
2. `toast.error()` para feedback visual
3. `throw error` para re-throw (importante!)

**Por quê re-throw:**
- Permite Vue Query atualizar estado (`isError`, `error`)
- Permite retry se configurado
- Mantém consistência de estado

### Padrão com useQuery

**✅ CORRETO:**
```typescript
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { getAllUsers as getAllUsersService } from '@/shared/api/users-api/getAllUsers'

const getAllUsers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      getAllUsersService().catch((error) => {
        toast.error(error?.response?.data?.message || 'Erro ao carregar usuários.')
        throw error
      }),
  })

  return { data, isLoading, error }
}
```

**Exemplo real do projeto:**
```typescript
// src/features/users/list-users/model/useListUsers.ts
const { data, isLoading } = useQuery({
  queryKey: ['getAllUsers', currentPage, perPage, filters],
  queryFn: () =>
    getAllUsersService(params.value).catch((error) =>
      toast.error(error?.response?.data?.message || 'Erro desconhecido.'),
    ),
})
```

---

## Uso de Toast para Feedback

### Toast de Erro

**Padrão:**
```typescript
toast.error(error?.response?.data?.message || 'Erro desconhecido.')
```

**Estrutura:**
- Primeiro tenta mensagem da API (`error?.response?.data?.message`)
- Fallback para mensagem genérica
- Sempre em português e user-friendly

**Exemplos:**
```typescript
// Erro de API
toast.error(error?.response?.data?.message || 'Erro ao processar solicitação.')

// Erro de validação
toast.error('Preencha os campos corretamente')

// Erro específico
toast.error('E-mail ou senha incorretos')
```

### Toast de Sucesso

**Padrão:**
```typescript
mutate(payload, {
  onSuccess: () => {
    toast.success('Operação realizada com sucesso')
  },
})
```

**Exemplos:**
```typescript
// Sucesso genérico
toast.success('Dados salvos com sucesso')

// Sucesso específico
toast.success('Usuário criado com sucesso!')
```

### Quando Usar Toast vs Erro Inline

**Toast para:**
- Erros de API/submit
- Mensagens de sucesso
- Feedback de ações

**Erro inline (FormMessage) para:**
- Erros de validação de campo
- Erros específicos de formulário

> **Formulários:** Ver `.cursor/skills/vue3-forms-validation/error-handling.md` para padrões específicos de validação e submit.

---

## Error Boundaries (Vue 3)

### Limitação do Vue 3

Vue 3 **não tem error boundaries** como React. Alternativas:

### Tratamento Global de Erros

**No `main.ts`:**
```typescript
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  toast.error('Ocorreu um erro inesperado. Tente novamente.')
}
```

### Tratamento em Componentes

**Com `onErrorCaptured`:**
```vue
<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import { toast } from 'vue-sonner'

onErrorCaptured((err) => {
  console.error('Component error:', err)
  toast.error('Erro ao carregar componente')
  return false // Previne propagação
})
</script>
```

**Nota:** Atualmente não implementado no projeto, mas pode ser adicionado se necessário.

---

## Logging de Erros para Debugging

### Quando Fazer Log

**✅ FAZER log quando:**
- Erros de API (para debugging)
- Erros inesperados
- Problemas de validação complexos

**❌ NÃO fazer log quando:**
- Erros esperados (ex: validação de formulário)
- Informações sensíveis (tokens, senhas)
- Dados pessoais

### Padrão de Logging

**✅ CORRETO:**
```typescript
.catch((error) => {
  // Log para debugging (apenas em desenvolvimento)
  if (import.meta.env.DEV) {
    console.error('API Error:', {
      endpoint: 'login',
      status: error?.response?.status,
      message: error?.response?.data?.message,
      // NÃO logar: payload, tokens, senhas
    })
  }

  toast.error(error?.response?.data?.message || 'Erro desconhecido.')
  throw error
})
```

**Estrutura de log:**
- Endpoint/action que falhou
- Status HTTP (se disponível)
- Mensagem de erro
- **NÃO incluir:** payloads, tokens, senhas, dados pessoais

### Logging Seguro

**❌ ERRADO - Logar dados sensíveis:**
```typescript
console.error('Login error:', { email, password }) // ❌ NUNCA fazer isso
```

**✅ CORRETO - Logar apenas informações seguras:**
```typescript
console.error('Login error:', {
  endpoint: 'login',
  status: error?.response?.status,
  // Não logar email/password
})
```

---

## Tratamento de Erros de Rede vs Validação

### Erros de API (Rede)

**Padrão:**
```typescript
.catch((error) => {
  const message = error?.response?.data?.message || 'Erro ao processar solicitação.'
  toast.error(message)
  throw error
})
```

**Tipos de erros:**
- 400 - Bad Request (dados inválidos)
- 401 - Unauthorized (não autenticado)
- 403 - Forbidden (sem permissão)
- 404 - Not Found (recurso não encontrado)
- 500 - Internal Server Error (erro do servidor)
- Network Error (sem conexão)

### Erros de Validação (Zod)

**Padrão:**
```typescript
const onSubmit = async (values: FormData) => {
  const { valid } = await validate()
  if (!valid) {
    return toast.error('Preencha os campos corretamente')
  }
  // Continuar com submit
}
```

**Diferença:**
- Validação: Erro antes de chamar API (toast genérico)
- API: Erro da resposta da API (mensagem específica)

### Tratamento Específico por Status

**Padrão avançado:**
```typescript
.catch((error) => {
  const status = error?.response?.status
  const message = error?.response?.data?.message

  switch (status) {
    case 400:
      toast.error(message || 'Dados inválidos')
      break
    case 401:
      toast.error('Sessão expirada. Faça login novamente.')
      // Interceptor já trata isso, mas pode customizar
      break
    case 403:
      toast.error('Você não tem permissão para esta ação.')
      break
    case 404:
      toast.error('Recurso não encontrado.')
      break
    case 500:
      toast.error('Erro no servidor. Tente novamente mais tarde.')
      break
    default:
      toast.error(message || 'Erro desconhecido.')
  }

  throw error
})
```

**Nota:** O projeto já tem interceptor para 401/403 em `handleUnauthorized.ts`.

---

## Mensagens de Erro User-Friendly

### Princípios

1. **Traduzir mensagens técnicas**
2. **Fornecer contexto útil**
3. **Sugerir ações quando possível**
4. **Ser claro e direto**

### Exemplos

**✅ CORRETO:**
```typescript
toast.error('E-mail ou senha incorretos')
toast.error('Preencha todos os campos obrigatórios')
toast.error('Erro ao salvar dados. Verifique sua conexão e tente novamente.')
toast.error('Usuário não encontrado')
```

**❌ ERRADO:**
```typescript
toast.error('Error 500')
toast.error('Validation failed')
toast.error(error.message) // Mensagem técnica
toast.error('Bad Request')
```

### Mensagens Contextuais

**Por tipo de ação:**
```typescript
// Criar
toast.error('Erro ao criar usuário. Tente novamente.')

// Atualizar
toast.error('Erro ao atualizar dados. Verifique os campos e tente novamente.')

// Deletar
toast.error('Erro ao excluir item. Tente novamente.')

// Buscar
toast.error('Erro ao carregar dados. Verifique sua conexão.')
```

---

## Padrão Completo de Error Handling

### Template de Composable

```typescript
import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { actionService } from '@/shared/api/feature-api/action'
import type { Payload } from '@/shared/api/feature-api/types/action.types'

const action = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: Payload) =>
      actionService(payload).catch((error) => {
        // Log para debugging (apenas em dev)
        if (import.meta.env.DEV) {
          console.error('API Error:', {
            endpoint: 'action',
            status: error?.response?.status,
            message: error?.response?.data?.message,
          })
        }

        // Feedback ao usuário
        const message = error?.response?.data?.message || 'Erro ao processar solicitação.'
        toast.error(message)

        // Re-throw para Vue Query
        throw error
      }),
  })

  return { isPending, isError, error, isSuccess, mutate }
}

export function useFeature() {
  return { action }
}
```

### Template de Submit com Validação

```typescript
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

const { handleSubmit, validate } = useForm({
  validationSchema: featureSchema,
  validateOnMount: false,
})

const onSubmit = async (values: FormData) => {
  // 1. Validar antes de submeter
  const { valid } = await validate()
  if (!valid) {
    return toast.error('Preencha os campos corretamente')
  }

  // 2. Preparar payload
  const payload: Payload = {
    field1: values.field1 || '',
    field2: values.field2 || '',
  }

  // 3. Submeter com tratamento de erro
  mutate(payload, {
    onSuccess: (response) => {
      toast.success('Operação realizada com sucesso')
      // Resetar formulário ou redirecionar
    },
    onError: (error) => {
      // Erro já tratado no composable, mas pode customizar aqui
      const message = error?.response?.data?.message || 'Erro ao processar solicitação.'
      toast.error(message)
    },
  })
}

const submitForm = handleSubmit(onSubmit)
```

---

## Interceptors HTTP

### Bearer Token Interceptor

**Já configurado** em `shared/api/config/interceptors/handleBearer.ts`:
- Adiciona token automaticamente
- Não precisa tratamento manual

### Unauthorized Interceptor

**Já configurado** em `shared/api/config/interceptors/handleUnauthorized.ts`:
- Trata 401/403 automaticamente
- Remove tokens
- Exibe toast de erro
- (Opcional) Redireciona para login

**Comportamento atual:**
```typescript
// handleUnauthorized.ts
if (httpStatus === 401 || httpStatus === 403) {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  
  setTimeout(() => {
    toast.error(errMsg)
  }, 1000)
}
```

**Nota:** Redirecionamento está comentado, mas pode ser ativado se necessário.

---

## Checklist de Implementação

Ao implementar error handling:

- [ ] Tratar erros em composables com `.catch()`
- [ ] Usar `toast.error()` para feedback visual
- [ ] Re-throw erro após toast (importante!)
- [ ] Validar antes de submeter formulários
- [ ] Usar mensagens user-friendly
- [ ] Logar erros apenas em desenvolvimento
- [ ] Não logar dados sensíveis
- [ ] Tratar erros de validação separadamente

---

## Exemplos Reais do Projeto

### Composable com Error Handling
```typescript
// src/features/auth/login-auth/model/useLogin.ts
const postLogin = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: Payload) =>
      postLoginService(payload).catch((error) =>
        toast.error(error?.response?.data?.message || 'Erro desconhecido.'),
      ),
  })

  return { isPending, isError, error, isSuccess, mutate }
}
```

### Submit com Validação
```typescript
// src/features/auth/login-auth/index.vue
const onSubmit = async (values: LoginPayload) => {
  const { valid } = await validate()
  if (!valid) return toast.error('Preencha os campos corretamente')

  const loginPayload: LoginPayload = {
    email: values.email || '',
    password: values.password || '',
  }

  postLoginMutate(loginPayload, {
    onSuccess(res) {
      if (!res) return
      router.push({ name: 'TwoFactorAuth' })
    },
  })
}
```

### Interceptor de Unauthorized
```typescript
// src/shared/api/config/interceptors/handleUnauthorized.ts
export function unauthorizedTokenInterceptor($http: AxiosInstance) {
  $http.interceptors.response.use(
    (response) => response,
    (error) => {
      const httpStatus = error?.response?.status || 401

      if (httpStatus === 401 || httpStatus === 403) {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')

        setTimeout(() => {
          toast.error(error?.response?.data?.message || 'Erro desconhecido.')
        }, 1000)
      }

      return Promise.reject(error)
    },
  )
}
```

---

## Recursos Relacionados

- [Vue Query Error Handling](https://tanstack.com/query/v5/docs/framework/vue/guides/error-handling)
- [Vue Sonner Docs](https://vue-sonner.vercel.app/)
- [VeeValidate Error Handling](https://vee-validate.logaretm.com/v4/guide/error-handling)
