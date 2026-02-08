import type { VueQueryPluginOptions } from '@tanstack/vue-query'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

// Criação do QueryClient com configurações padrão
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Sempre busca novos
      gcTime: 0, // Limpa o cache imediatamente
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const options: VueQueryPluginOptions = {
  queryClient,
  enableDevtoolsV6Plugin: true,
}

export { queryClient, options, VueQueryPlugin }
