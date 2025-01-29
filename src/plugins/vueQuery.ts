import type { VueQueryPluginOptions } from '@tanstack/vue-query'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

// Criação do QueryClient com configurações padrão
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: false,
    },
  },
})

const options: VueQueryPluginOptions = {
  queryClient,
  enableDevtoolsV6Plugin: true,
}

export { queryClient, options, VueQueryPlugin }
