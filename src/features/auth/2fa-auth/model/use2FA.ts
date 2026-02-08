import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

import { postResendCode as postResendCodeService } from '@/shared/api/auth-api/postResendCode'
import { postTwoFactor as postTwoFactorService } from '@/shared/api/auth-api/postTwoFactor'
import type { Payload as PostResendCodePayload } from '@/shared/api/auth-api/types/postResendCode.types'
import type { Payload as PostTwoFactorPayload } from '@/shared/api/auth-api/types/postTwoFactor.types'

const postTwoFactorAuth = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: PostTwoFactorPayload) =>
      postTwoFactorService(payload).catch((error) =>
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

const postResendCode = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: PostResendCodePayload) =>
      postResendCodeService(payload).catch((error) =>
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

export function use2FA() {
  return {
    postTwoFactorAuth,
    postResendCode,
  }
}
