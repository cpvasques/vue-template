# Guia de Troubleshooting

Guia completo para resolver problemas comuns durante o desenvolvimento no projeto Vue 3.

---

## 🔧 Problemas de Build

### Erros comuns do Vite

#### Erro: "Cannot find module" ou "Module not found"

**Causa:** Import incorreto ou alias não configurado.

**Solução:**
1. Verifique se está usando o alias `@/` corretamente:
   ```typescript
   // ✅ CORRETO
   import { useLogin } from '@/features/auth/login-auth/model/useLogin'
   
   // ❌ ERRADO
   import { useLogin } from '../../../features/auth/login-auth/model/useLogin'
   ```

2. Verifique a configuração do alias em `vite.config.ts`:
   ```typescript
   resolve: {
     alias: {
       '@': fileURLToPath(new URL('./src', import.meta.url)),
     },
   }
   ```

3. Verifique se o arquivo existe no caminho especificado.

#### Erro: "Failed to resolve import"

**Causa:** Dependência não instalada ou import incorreto.

**Solução:**
1. Verifique se a dependência está instalada:
   ```bash
   npm install nome-da-dependencia
   ```

2. Verifique se o import está correto:
   ```typescript
   // Verifique a documentação da biblioteca para o caminho correto
   ```

3. Limpe o cache e reinstale:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

#### Erro: "Port 8080 is already in use"

**Causa:** Outro processo está usando a porta 8080.

**Solução:**
1. Pare o processo que está usando a porta:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:8080 | xargs kill -9
   ```

2. Ou altere a porta no `vite.config.ts`:
   ```typescript
   server: {
     port: 3000, // Outra porta
   }
   ```

#### Erro: "chunkSizeWarningLimit exceeded"

**Causa:** Bundle muito grande.

**Solução:**
1. Verifique se está usando lazy loading nas rotas:
   ```typescript
   // ✅ CORRETO
   component: () => import('@/pages/users/UsersView.vue')
   
   // ❌ ERRADO
   import UsersView from '@/pages/users/UsersView.vue'
   component: UsersView
   ```

2. Analise o bundle:
   ```bash
   npm run build
   npx vite-bundle-visualizer
   ```

3. Configure code splitting manual se necessário (ver `performance.md`).

---

## 📦 Problemas de Dependências

### Erro: "Peer dependency warnings"

**Causa:** Versões incompatíveis de dependências.

**Solução:**
1. Verifique as versões compatíveis no `package.json`
2. Atualize as dependências:
   ```bash
   npm update
   ```

### Erro: "Cannot find type definitions"

**Causa:** Tipos TypeScript não encontrados.

**Solução:**
1. Instale os tipos:
   ```bash
   npm install --save-dev @types/nome-da-dependencia
   ```

2. Se não existir tipos, crie um arquivo de declaração:
   ```typescript
   // src/types/nome-da-dependencia.d.ts
   declare module 'nome-da-dependencia'
   ```

### Erro: "Module has no exported member"

**Causa:** Import incorreto ou versão incompatível.

**Solução:**
1. Verifique a documentação da biblioteca para o import correto
2. Verifique se a versão instalada suporta o que você está tentando importar
3. Use import default se necessário:
   ```typescript
   import Component from 'biblioteca'
   // ao invés de
   import { Component } from 'biblioteca'
   ```

---

## 🔷 Problemas de TypeScript

### Erro: "Type 'X' is not assignable to type 'Y'"

**Causa:** Tipos incompatíveis.

**Solução:**
1. Verifique se os tipos estão corretos:
   ```typescript
   // Use z.infer para tipos derivados de schemas Zod
   export type FormData = z.infer<typeof schema>
   ```

2. Use type assertions quando necessário (com cuidado):
   ```typescript
   const value = data as ExpectedType
   ```

3. Verifique se está usando os tipos corretos dos endpoints:
   ```typescript
   import type { Response } from '@/shared/api/auth-api/types/postLogin.types'
   ```

### Erro: "Property 'X' does not exist on type 'Y'"

**Causa:** Propriedade não existe no tipo ou tipo incorreto.

**Solução:**
1. Verifique a definição do tipo:
   ```typescript
   interface User {
     id: number
     name: string
   }
   ```

2. Use optional chaining se a propriedade pode não existir:
   ```typescript
   const value = user?.property
   ```

3. Verifique se está usando o tipo correto importado.

### Erro: "Cannot find name 'ref'", "Cannot find name 'computed'"

**Causa:** Auto-imports não funcionando ou import manual necessário.

**Solução:**
1. Verifique se `unplugin-auto-import` está configurado em `vite.config.ts`:
   ```typescript
   AutoImport({
     imports: ['vue', '@vueuse/core', 'vee-validate', 'vue-router'],
     dts: 'src/auto-imports.d.ts',
   })
   ```

2. Se necessário, importe manualmente:
   ```typescript
   import { ref, computed } from 'vue'
   ```

3. Regenerar auto-imports:
   ```bash
   # Reinicie o servidor de desenvolvimento
   npm run dev
   ```

### Erro: "Type instantiation is excessively deep and possibly infinite"

**Causa:** Tipos recursivos ou muito complexos.

**Solução:**
1. Simplifique os tipos
2. Use `any` temporariamente para debug (não em produção):
   ```typescript
   const data: any = response.data
   ```

3. Verifique se há tipos circulares.

---

## 🧪 Problemas de Lint

### Erro: "Unexpected console.log"

**Causa:** Regra do ESLint proibindo console.log.

**Solução:**
1. Remova o console.log ou use uma alternativa:
   ```typescript
   // Em desenvolvimento
   if (import.meta.env.DEV) {
     console.log('Debug info')
   }
   ```

2. Ou desabilite a regra para a linha específica:
   ```typescript
   // eslint-disable-next-line no-console
   console.log('Debug')
   ```

### Erro: "Prettier formatting issues"

**Causa:** Código não formatado conforme Prettier.

**Solução:**
1. Formate o código:
   ```bash
   npm run format
   ```

2. Ou corrija automaticamente:
   ```bash
   npm run lint:fix
   ```

### Erro: "Import order issues"

**Causa:** Imports não estão na ordem correta.

**Solução:**
1. Corrija automaticamente:
   ```bash
   npm run lint:fix
   ```

2. Ordem esperada:
   ```typescript
   // 1. Vue e Vue Router
   import { ref } from 'vue'
   import { useRouter } from 'vue-router'
   
   // 2. Bibliotecas externas
   import axios from 'axios'
   
   // 3. Imports internos com alias @/
   import { useLogin } from '@/features/auth/login-auth/model/useLogin'
   ```

---

## 🔄 Problemas com MSW (Mock Service Worker)

### Service worker não inicializa

**Causa:** Arquivo `mockServiceWorker.js` não existe ou variável de ambiente não configurada.

**Solução:**
1. Verifique se a variável de ambiente está configurada no `.env`:
   ```env
   VITE_ENABLE_MOCK_SERVER=true
   ```

2. Gere o arquivo do service worker:
   ```bash
   npx msw init public
   ```

3. Verifique se o arquivo foi gerado em `public/mockServiceWorker.js`

4. Verifique a configuração em `src/app/main.ts`:
   ```typescript
   if (import.meta.env.VITE_ENABLE_MOCK_SERVER === 'true') {
     const { worker } = await import('../shared/mocks/browser.ts')
     worker.start()
   }
   ```

### Handlers não funcionam

**Causa:** Handler incorreto ou URL não corresponde.

**Solução:**
1. Verifique se a URL do handler corresponde à URL da requisição:
   ```typescript
   // Handler
   http.post('http://localhost:8080/auth/login', () => {
     return HttpResponse.json({ ... })
   })
   
   // Requisição deve usar a mesma URL base
   ```

2. Verifique se o handler está registrado em `src/shared/mocks/handlers.ts`:
   ```typescript
   export const handlers = [
     http.post('...', handler),
     // ... outros handlers
   ]
   ```

3. Verifique o console do navegador para erros do MSW

### Mocks não são interceptados em testes

**Causa:** MSW não configurado nos testes ou handlers incorretos.

**Solução:**
1. Para testes unitários, use MSW handlers diretamente:
   ```typescript
   import { http, HttpResponse } from 'msw'
   import { setupServer } from 'msw/node'
   
   const server = setupServer(
     http.post('*/auth/login', () => {
       return HttpResponse.json({ ... })
     })
   )
   
   beforeAll(() => server.listen())
   afterEach(() => server.resetHandlers())
   afterAll(() => server.close())
   ```

2. Para testes E2E, use `page.route`:
   ```typescript
   await page.route('**/auth/login', route => {
     route.fulfill({
       status: 200,
       body: JSON.stringify({ ... }),
     })
   })
   ```

---

## 🎨 Problemas com Imports e Aliases

### Erro: "Cannot resolve '@/' alias"

**Causa:** Alias não configurado corretamente.

**Solução:**
1. Verifique `vite.config.ts`:
   ```typescript
   resolve: {
     alias: {
       '@': fileURLToPath(new URL('./src', import.meta.url)),
     },
   }
   ```

2. Verifique `tsconfig.app.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

3. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Erro: "Auto-imports não funcionam"

**Causa:** Configuração do `unplugin-auto-import` incorreta.

**Solução:**
1. Verifique `vite.config.ts`:
   ```typescript
   AutoImport({
     imports: ['vue', '@vueuse/core', 'vee-validate', 'vue-router'],
     dts: 'src/auto-imports.d.ts',
     vueTemplate: true,
   })
   ```

2. Verifique se o arquivo `src/auto-imports.d.ts` existe e está atualizado

3. Reinicie o servidor de desenvolvimento

### Erro: "Component not found" (auto-import de componentes)

**Causa:** Componente não está sendo auto-importado corretamente.

**Solução:**
1. Verifique se `unplugin-vue-components` está configurado:
   ```typescript
   Components({
     dts: true,
   })
   ```

2. Verifique se o componente está em um local reconhecido (ex: `src/components/`)

3. Se necessário, importe manualmente:
   ```typescript
   import Component from '@/components/Component.vue'
   ```

---

## ⚡ Problemas de Performance

### Bundle muito grande

**Causa:** Imports estáticos de bibliotecas grandes ou falta de code splitting.

**Solução:**
1. Use lazy loading nas rotas:
   ```typescript
   component: () => import('@/pages/users/UsersView.vue')
   ```

2. Use dynamic imports para bibliotecas grandes:
   ```typescript
   const loadChart = async () => {
     const { Chart } = await import('chart.js')
   }
   ```

3. Analise o bundle:
   ```bash
   npm run build
   npx vite-bundle-visualizer
   ```

4. Configure manual chunks se necessário (ver `PERFORMANCE.md`)

### Lazy loading não funciona

**Causa:** Import estático ou configuração incorreta.

**Solução:**
1. Verifique se está usando função de import:
   ```typescript
   // ✅ CORRETO
   component: () => import('@/pages/users/UsersView.vue')
   
   // ❌ ERRADO
   import UsersView from '@/pages/users/UsersView.vue'
   component: UsersView
   ```

2. Verifique se o componente está exportado como default:
   ```vue
   <script setup lang="ts">
   // Componente já é exportado como default automaticamente
   </script>
   ```

### Re-renderizações excessivas

**Causa:** Reatividade desnecessária ou computed/methods incorretos.

**Solução:**
1. Use `computed` ao invés de `methods` para valores derivados:
   ```typescript
   // ✅ CORRETO
   const filtered = computed(() => items.value.filter(...))
   
   // ❌ ERRADO
   const filtered = () => items.value.filter(...)
   ```

2. Use `shallowRef` para objetos grandes:
   ```typescript
   const largeData = shallowRef({ ... })
   ```

3. Use `markRaw` para objetos que não precisam ser reativos:
   ```typescript
   const chartInstance = markRaw(new Chart(...))
   ```

---

## 🧩 Problemas com Vue Router

### Erro: "Route not found" ou "Cannot resolve route"

**Causa:** Rota não registrada ou path incorreto.

**Solução:**
1. Verifique se a rota está registrada em `src/app/providers/router/index.ts`

2. Verifique se o path está correto:
   ```typescript
   {
     path: '/users', // ✅ Sem barra no final (exceto root)
     name: 'Users',
     component: () => import('@/pages/users/UsersView.vue'),
   }
   ```

3. Use `router.push` com o nome da rota:
   ```typescript
   router.push({ name: 'Users' })
   ```

### Erro: "Navigation guard" ou "beforeEnter" não funciona

**Causa:** Guard incorreto ou não retornando valor.

**Solução:**
1. Verifique se o guard retorna um valor:
   ```typescript
   beforeEnter: (to, from, next) => {
     if (isAuthenticated.value) {
       next()
     } else {
       next('/login')
     }
   }
   ```

2. Ou use async/await corretamente:
   ```typescript
   beforeEnter: async (to, from, next) => {
     const isAuth = await checkAuth()
     if (isAuth) {
       next()
     } else {
       next('/login')
     }
   }
   ```

---

## 🔐 Problemas com Autenticação

### Token não é enviado nas requisições

**Causa:** Interceptor não configurado ou token não está no localStorage.

**Solução:**
1. Verifique se o interceptor está configurado em `src/shared/api/config/interceptors/handleBearer.ts`

2. Verifique se o token está sendo salvo:
   ```typescript
   localStorage.setItem('accessToken', token)
   ```

3. Verifique se o interceptor está lendo do localStorage:
   ```typescript
   const token = localStorage.getItem('accessToken')
   ```

### Erro 401 (Unauthorized) não redireciona

**Causa:** Interceptor de unauthorized não configurado.

**Solução:**
1. Verifique se o interceptor está em `src/shared/api/config/interceptors/handleUnauthorized.ts`

2. Verifique se está redirecionando corretamente:
   ```typescript
   if (error.response?.status === 401) {
     router.push('/login')
   }
   ```

---

## 📝 Checklist de Troubleshooting

Antes de pedir ajuda, verifique:

- [ ] Limpei o cache e reinstalei dependências (`rm -rf node_modules && npm install`)
- [ ] Reiniciei o servidor de desenvolvimento
- [ ] Verifiquei se o erro está na documentação ou issues do GitHub
- [ ] Verifiquei se estou usando as versões corretas das dependências
- [ ] Verifiquei se o código segue os padrões do projeto
- [ ] Verifiquei os logs do console do navegador
- [ ] Verifiquei os logs do terminal do servidor
- [ ] Verifiquei se o problema ocorre em outros ambientes (dev/prod)

---

## 🆘 Quando Pedir Ajuda

Se após seguir este guia o problema persistir:

1. **Documente o problema:**
   - Erro exato (mensagem completa)
   - Passos para reproduzir
   - Ambiente (OS, Node version, etc)
   - Código relevante

2. **Verifique issues conhecidas:**
   - GitHub do projeto
   - Issues das dependências usadas

3. **Peça ajuda:**
   - Inclua todas as informações documentadas
   - Inclua screenshots se relevante
   - Inclua trechos de código relevantes

---

## 📚 Recursos Adicionais

- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do Vue 3](https://vuejs.org/)
- [Documentação do TypeScript](https://www.typescriptlang.org/)
- [Documentação do MSW](https://mswjs.io/)
- [Documentação do Vue Router](https://router.vuejs.org/)

---

**Nota:** Este documento deve ser atualizado conforme novos problemas aparecem no projeto.
