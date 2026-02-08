import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

import { postNewPassword as postNewPasswordService } from '@/shared/api/auth-api/postNewPassword'
import type { Payload as PostNewPasswordPayload } from '@/shared/api/auth-api/types/postNewPassword.types'

const postNewPassword = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: PostNewPasswordPayload) =>
      postNewPasswordService(payload).catch((error) =>
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

export function useNewPassword() {
  return {
    postNewPassword,
  }
}
