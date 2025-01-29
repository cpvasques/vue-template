import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

import { postLogin as postLoginService } from '@/services/auth/postLogin'
import type { Params as PostLoginPayload } from '@/services/auth/postLogin.types'

const postLogin = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: PostLoginPayload) =>
      postLoginService(payload).catch((error) =>
        toast.error(error?.response?.data?.message || 'Erro desconhecido.'),
      ),
  })

  return {
    isPending,
    isError,
    error,
    isSuccess,
    mutate,
  }
}

export function useAuth() {
  return {
    postLogin,
  }
}
