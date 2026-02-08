import { useMutation, useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

import { getUserById as getUserByIdService } from '@/shared/api/users-api/getUserById'
import { postNewUser as postNewUserService } from '@/shared/api/users-api/postNewUser'
import type { Payload as PostNewUserPayload } from '@/shared/api/users-api/types/postNewUser.types'
import type { Payload as UpdateUserPayload } from '@/shared/api/users-api/types/updateUser.types'
import { updateUser as updateUserService } from '@/shared/api/users-api/updateUser'

const getUserById = () => {
  const id = ref('')

  const enabled = computed(() => !!id.value)

  const { isPending, data, error, isFetching, refetch } = useQuery({
    queryKey: ['getUserById', id],
    queryFn: () =>
      getUserByIdService(id.value).catch((error) =>
        toast.error(error?.response?.data?.message || 'Erro desconhecido.'),
      ),
    enabled,
  })

  return {
    isPending,
    isFetching,
    data,
    error,
    id,
    refetch,
  }
}

const postNewUser = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: PostNewUserPayload) =>
      postNewUserService(payload).catch((error) =>
        toast.error(error?.response?.data?.message || 'Erro desconhecido.'),
      ),
  })

  return { isPending, isError, error, isSuccess, mutate }
}

const updateUser = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      updateUserService(payload).catch((error) =>
        toast.error(error?.response?.data?.message || 'Erro desconhecido.'),
      ),
  })

  return { isPending, isError, error, isSuccess, mutate }
}

export function useHandleUsers() {
  return {
    getUserById,
    postNewUser,
    updateUser,
  }
}
