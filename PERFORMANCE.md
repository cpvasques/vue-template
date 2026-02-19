# Performance Monitoring e Análise

Guia completo para monitorar, analisar e otimizar a performance da aplicação Vue 3.

> **Nota:** Este documento complementa `.cursor/skills/vue3-fsd-development/performance.md`, focando em monitoramento e análise de métricas.

---

## 📊 Métricas de Performance

### Core Web Vitals

Core Web Vitals são métricas essenciais para experiência do usuário:

#### LCP (Largest Contentful Paint)
- **Meta:** < 2.5 segundos
- **Mede:** Tempo para renderizar o maior elemento visível
- **Impacto:** Percepção de velocidade de carregamento

#### FID (First Input Delay) / INP (Interaction to Next Paint)
- **Meta:** < 100ms (FID) / < 200ms (INP)
- **Mede:** Tempo de resposta à primeira interação do usuário
- **Impacto:** Responsividade da aplicação

#### CLS (Cumulative Layout Shift)
- **Meta:** < 0.1
- **Mede:** Estabilidade visual durante o carregamento
- **Impacto:** Experiência visual consistente

### Métricas Adicionais

#### FCP (First Contentful Paint)
- **Meta:** < 1.8 segundos
- **Mede:** Tempo para primeiro conteúdo visível
- **Impacto:** Percepção inicial de carregamento

#### TTI (Time to Interactive)
- **Meta:** < 3.8 segundos
- **Mede:** Tempo até a página estar totalmente interativa
- **Impacto:** Quando o usuário pode interagir efetivamente

#### TBT (Total Blocking Time)
- **Meta:** < 200ms
- **Mede:** Tempo total que o thread principal está bloqueado
- **Impacto:** Responsividade durante carregamento

### Bundle Size

#### Tamanhos Recomendados
- **JavaScript inicial:** < 200KB (gzipped)
- **CSS inicial:** < 50KB (gzipped)
- **Total inicial:** < 300KB (gzipped)

#### Análise de Chunks
- **Vendor chunks:** Separados por biblioteca (vue, vue-router, etc)
- **Feature chunks:** Um por rota/feature
- **Shared chunks:** Código compartilhado entre features

---

## 🛠️ Ferramentas de Análise

### Lighthouse

Lighthouse é uma ferramenta integrada ao Chrome DevTools para análise completa de performance.

#### Como Usar

1. **Via Chrome DevTools:**
   - Abra DevTools (F12)
   - Vá para a aba "Lighthouse"
   - Selecione "Performance"
   - Clique em "Generate report"

2. **Via CLI:**
   ```bash
   npm install -g lighthouse
   lighthouse http://localhost:8080 --view
   ```

3. **Via Node.js:**
   ```bash
   npm install --save-dev lighthouse
   ```

#### O que Analisar

- **Performance Score:** Score geral (meta: > 90)
- **Core Web Vitals:** LCP, FID/INP, CLS
- **Opportunities:** Sugestões de otimização
- **Diagnostics:** Informações detalhadas sobre problemas

#### Exemplo de Uso em CI/CD

```typescript
// scripts/lighthouse-ci.js
import lighthouse from 'lighthouse'
import chromeLauncher from 'chrome-launcher'

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  const options = { logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port }
  
  const runnerResult = await lighthouse('http://localhost:8080', options)
  
  // Verificar métricas
  const lcp = runnerResult.lhr.audits['largest-contentful-paint'].numericValue
  if (lcp > 2500) {
    throw new Error(`LCP ${lcp}ms exceeds 2500ms threshold`)
  }
  
  await chrome.kill()
}
```

### Bundle Analyzer (vite-bundle-visualizer)

Ferramenta para visualizar e analisar o tamanho do bundle.

#### Instalação e Uso

```bash
npm install --save-dev vite-bundle-visualizer

# Adicionar ao vite.config.ts
import { visualizer } from 'vite-bundle-visualizer'

export default defineConfig({
  plugins: [
    // ... outros plugins
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

```bash
npm run build
# Abre automaticamente a visualização do bundle
```

#### O que Analisar

- **Chunks grandes:** Identificar bibliotecas ou features pesadas
- **Duplicações:** Código duplicado em múltiplos chunks
- **Bibliotecas não utilizadas:** Tree-shaking não funcionando
- **Oportunidades de code splitting:** Features que podem ser lazy loaded

### Vue DevTools Performance

Ferramenta integrada ao Vue DevTools para análise de performance de componentes.

#### Como Usar

1. Instale a extensão Vue DevTools no Chrome/Firefox
2. Abra DevTools e vá para a aba "Vue"
3. Use a aba "Performance" para profiling

#### O que Analisar

- **Component render time:** Tempo de renderização de cada componente
- **Re-renders:** Componentes que re-renderizam desnecessariamente
- **Watchers:** Watchers que executam com frequência
- **Memory leaks:** Vazamentos de memória

### Chrome DevTools Performance

Ferramenta nativa do Chrome para análise detalhada de performance.

#### Como Usar

1. Abra Chrome DevTools (F12)
2. Vá para a aba "Performance"
3. Clique em "Record" (ou Ctrl+E)
4. Interaja com a aplicação
5. Pare a gravação

#### O que Analisar

- **Main thread:** Atividade do thread principal
- **Frames:** FPS e frames perdidos
- **Network:** Requisições e tempos de resposta
- **Memory:** Uso de memória ao longo do tempo

#### Exemplo de Análise

```
Performance Profiling Checklist:
- [ ] FPS estável (> 60 FPS)
- [ ] Sem long tasks (> 50ms)
- [ ] Sem layout thrashing
- [ ] Memory não aumenta continuamente
- [ ] Network requests otimizadas
```

### Web Vitals Library

Biblioteca para medir Core Web Vitals programaticamente.

#### Instalação

```bash
npm install web-vitals
```

#### Uso Básico

```typescript
// src/app/plugins/web-vitals.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Enviar para serviço de analytics
  if (import.meta.env.PROD) {
    // Exemplo: Google Analytics
    // gtag('event', metric.name, {
    //   value: Math.round(metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // })
    
    console.log('Web Vital:', metric.name, metric.value)
  }
}

export function setupWebVitals() {
  if (import.meta.env.PROD) {
    onCLS(sendToAnalytics)
    onFID(sendToAnalytics)
    onLCP(sendToAnalytics)
    onFCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  }
}
```

```typescript
// src/app/main.ts
import { setupWebVitals } from './plugins/web-vitals'

setupWebVitals()
```

---

## 🔍 Como Identificar Bottlenecks

### Análise de Bundle

#### 1. Identificar Chunks Grandes

```bash
npm run build
npx vite-bundle-visualizer
```

**Problemas comuns:**
- Bibliotecas grandes no bundle inicial
- Features não lazy loaded
- Código duplicado

**Soluções:**
- Lazy load de rotas
- Dynamic imports de bibliotecas grandes
- Code splitting manual

#### 2. Verificar Tree Shaking

```typescript
// ❌ ERRADO - Importa tudo
import * as lodash from 'lodash'

// ✅ CORRETO - Importa apenas o necessário
import { pickBy } from 'lodash'
```

#### 3. Analisar Dependências

```bash
npm run build -- --report
# Ou use
npx vite-bundle-visualizer
```

Verifique:
- Dependências duplicadas
- Versões diferentes da mesma biblioteca
- Bibliotecas não utilizadas

### Performance Profiling

#### 1. Identificar Componentes Lentos

Use Vue DevTools Performance:

```vue
<!-- Componente lento identificado -->
<script setup lang="ts">
// Otimizações possíveis:
// 1. Usar computed ao invés de methods
// 2. Usar v-memo para listas grandes
// 3. Lazy load de componentes pesados
</script>
```

#### 2. Identificar Re-renders Desnecessários

```typescript
// Use Vue DevTools para identificar componentes que re-renderizam muito

// Solução: useMemo ou v-memo
<template>
  <ExpensiveComponent v-memo="[dependency1, dependency2]" />
</template>
```

#### 3. Identificar Watchers Pesados

```typescript
// ❌ ERRADO - Watcher executa muito
watch(data, () => {
  expensiveComputation()
})

// ✅ CORRETO - Debounce ou computed
const debouncedComputation = useDebounceFn(() => {
  expensiveComputation()
}, 300)

watch(data, debouncedComputation)
```

### Network Analysis

#### 1. Analisar Requisições

Use Chrome DevTools Network:

- **Waterfall:** Tempo de cada requisição
- **Size:** Tamanho das respostas
- **Time:** Tempo total de carregamento

#### 2. Identificar Requisições Lentas

```typescript
// Adicionar logging de performance
const startTime = performance.now()
await apiCall()
const duration = performance.now() - startTime

if (duration > 1000) {
  console.warn('Slow API call:', duration, 'ms')
}
```

#### 3. Verificar Cache

- **HTTP Cache:** Headers de cache corretos?
- **Vue Query Cache:** staleTime e gcTime configurados?
- **Service Worker:** Cache funcionando?

---

## 🚀 Estratégias de Otimização

### Code Splitting

#### Route-Based Splitting (Automático)

```typescript
// ✅ CORRETO - Vite cria chunks automaticamente
{
  path: '/users',
  component: () => import('@/pages/users/UsersView.vue'),
}
```

#### Feature-Based Splitting

```typescript
// Para features muito grandes
{
  path: '/admin',
  component: () => import(
    /* webpackChunkName: "admin" */
    '@/pages/admin/AdminView.vue'
  ),
}
```

#### Component-Based Splitting

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeavyComponent = defineAsyncComponent({
  loader: () => import('@/widgets/heavy-component/index.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000,
})
</script>
```

### Lazy Loading

#### Rotas

```typescript
// ✅ SEMPRE usar
component: () => import('@/pages/users/UsersView.vue')
```

#### Componentes

```vue
<script setup lang="ts">
const loadChart = async () => {
  const { Chart } = await import('chart.js')
  // Usar Chart
}
</script>
```

#### Bibliotecas

```typescript
// ✅ CORRETO
const loadMoment = async () => {
  const moment = await import('moment')
  return moment.default
}

// ❌ ERRADO
import moment from 'moment'
```

### Tree Shaking

#### Imports Específicos

```typescript
// ✅ CORRETO
import { pickBy } from 'lodash'

// ❌ ERRADO
import * as _ from 'lodash'
```

#### Configuração Vite

```typescript
// vite.config.ts
export default defineConfig({
  build: {
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

### Image Optimization

#### Lazy Loading

```vue
<template>
  <img 
    :src="imageUrl" 
    alt="Description"
    loading="lazy"
  />
</template>
```

#### Responsive Images

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

#### WebP Format

```vue
<template>
  <picture>
    <source :srcset="webpUrl" type="image/webp" />
    <img :src="fallbackUrl" alt="Description" />
  </picture>
</template>
```

### Vue Query Optimization

#### Configuração Otimizada

```typescript
// app/plugins/vueQuery.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

#### Query Keys Reativas

```typescript
// ✅ CORRETO
const { data } = useQuery({
  queryKey: ['users', currentPage, filters], // Reativa
  queryFn: () => getAllUsers({
    page: currentPage.value,
    ...filters.value,
  }),
})
```

---

## 📈 Monitoramento em Produção

### Ferramentas Sugeridas

#### Google Analytics 4

```typescript
// Enviar Web Vitals para GA4
import { onCLS, onFID, onLCP } from 'web-vitals'

function sendToGA(metric: any) {
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_label: metric.id,
    non_interaction: true,
  })
}

onCLS(sendToGA)
onFID(sendToGA)
onLCP(sendToGA)
```

#### Sentry Performance Monitoring

```bash
npm install @sentry/vue
```

```typescript
// src/app/plugins/sentry.ts
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0, // Ajustar em produção
})
```

#### Custom Analytics

```typescript
// src/shared/lib/analytics.ts
export function trackPerformance(metric: string, value: number) {
  if (import.meta.env.PROD) {
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ metric, value }),
    })
  }
}
```

### Métricas Importantes

#### Client-Side Metrics

- **Core Web Vitals:** LCP, FID/INP, CLS
- **Page Load Time:** Tempo total de carregamento
- **Time to Interactive:** TTI
- **Bundle Size:** Tamanho dos chunks

#### API Metrics

- **Response Time:** Tempo de resposta das APIs
- **Error Rate:** Taxa de erros
- **Cache Hit Rate:** Taxa de cache hits

#### User Experience Metrics

- **Bounce Rate:** Taxa de rejeição
- **Session Duration:** Duração da sessão
- **Page Views:** Visualizações de página

### Alertas

#### Configurar Alertas

```typescript
// Exemplo: Alertar se LCP > 3s
onLCP((metric) => {
  if (metric.value > 3000) {
    // Enviar alerta
    sendAlert('LCP exceeded threshold', metric.value)
  }
})
```

#### Thresholds Recomendados

- **LCP:** > 2.5s (alerta)
- **FID/INP:** > 100ms/200ms (alerta)
- **CLS:** > 0.1 (alerta)
- **Error Rate:** > 1% (alerta)
- **API Response Time:** > 1s (alerta)

---

## 📋 Checklist de Performance

### Antes do Deploy

- [ ] Lighthouse score > 90
- [ ] LCP < 2.5s
- [ ] FID/INP < 100ms/200ms
- [ ] CLS < 0.1
- [ ] Bundle inicial < 300KB (gzipped)
- [ ] Todas as rotas usam lazy loading
- [ ] Imagens otimizadas e com lazy loading
- [ ] Vue Query configurado com staleTime e gcTime
- [ ] Web Vitals configurado para monitoramento
- [ ] Bundle analyzer executado e chunks otimizados

### Monitoramento Contínuo

- [ ] Web Vitals sendo coletados
- [ ] Alertas configurados para métricas críticas
- [ ] Performance reviews semanais
- [ ] Bundle size monitorado a cada release
- [ ] Análise de regressões de performance

---

## 🔗 Recursos Adicionais

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Vite Bundle Visualizer](https://github.com/antfu/vite-bundle-visualizer)
- [Vue DevTools](https://devtools.vuejs.org/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

**Nota:** Este documento deve ser atualizado conforme novas ferramentas e métricas são adotadas no projeto.
