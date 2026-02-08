import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

import { deleteUser as deleteUserService } from '@/shared/api/users-api/deleteUser'

const deleteUser = () => {
  const { isPending, isError, error, isSuccess, mutate } = useMutation({
    mutationFn: (id: string) =>
      deleteUserService(id).catch((error) =>
        toast.error(error?.response?.data?.message || 'Erro desconhecido.'),
      ),
  })

  return { isPending, isError, error, isSuccess, mutate }
}

export function useDeleteUsers() {
  return {
    deleteUser,
  }
}
