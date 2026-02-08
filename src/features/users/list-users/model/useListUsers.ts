import { useQuery } from '@tanstack/vue-query'
import { pickBy } from 'lodash'
import { toast } from 'vue-sonner'

import { getAllUsers as getAllUsersService } from '@/shared/api/users-api/getAllUsers'

const getAllUsers = () => {
  const currentPage = ref(1)
  const perPage = ref(10)
  const filters = ref({})

  const params = computed(() => ({
    page: currentPage.value,
    perPage: perPage.value,
    ...pickBy(filters.value),
  }))

  const { isPending, data, error, isFetching, isLoading, refetch } = useQuery({
    queryKey: ['getAllUsers', currentPage, perPage, filters],
    queryFn: () =>
      getAllUsersService(params.value).catch((error) =>
        toast.error(error?.response?.data?.message || 'Erro desconhecido.'),
      ),
  })

  return {
    isPending,
    isFetching,
    isLoading,
    data,
    error,
    currentPage,
    perPage,
    filters,
    refetch,
  }
}

export function useListUsers() {
  return {
    getAllUsers,
  }
}
