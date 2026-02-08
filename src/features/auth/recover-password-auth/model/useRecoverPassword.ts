import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

import { postRecover as postRecoverService } from '@/shared/api/auth-api/postRecover'
import type { Payload as PostRecoverPayload } from '@/shared/api/auth-api/types/postRecover.types'

const postRecoverPassword = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: PostRecoverPayload) =>
      postRecoverService(payload).catch((error) =>
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

export function useRecoverPassword() {
  return {
    postRecoverPassword,
  }
}
