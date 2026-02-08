import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

import { postNewPhoto as postNewPhotoService } from '@/shared/api/profile-api/postNewPhoto'
import type { Payload as postNewProfilePayload } from '@/shared/api/profile-api/types/postNewPhoto.types'

const postNewPhoto = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: postNewProfilePayload) =>
      postNewPhotoService(payload).catch((error) =>
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

export function useChangePhoto() {
  return {
    postNewPhoto,
  }
}
