import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

export default function useVueQueryPlugin(app) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // Considera 5 minutos que são os dados mais atualizados.
      },
    },
  });

  app.use(VueQueryPlugin, {
    queryClient,
  });
}
