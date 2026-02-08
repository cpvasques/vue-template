import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

import { postLogin as postLoginService } from '@/shared/api/auth-api/postLogin'
import type { Payload as PostLoginPayload } from '@/shared/api/auth-api/types/postLogin.types'

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

export function useLogin() {
  return {
    postLogin,
  }
}
