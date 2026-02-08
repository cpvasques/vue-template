<script setup lang="ts">
import { Button } from '@/shared/components/button'

import DeleteUserDialog from '@/features/users/delete-users/index.vue'
import UserDialog from '@/features/users/handle-users/index.vue'
import UsersTable from '@/features/users/list-users/index.vue'
import { useListUsers } from '@/features/users/list-users/model/useListUsers'
import type {
  Response,
  User,
} from '@/shared/api/users-api/types/getAllUsers.types'
import PageTitle from '@/widgets/page-title/index.vue'

const { getAllUsers } = useListUsers()

const {
  isFetching: isLoadingUsers,
  data: usersData,
  currentPage,
  filters,
} = getAllUsers()

const mockedUserData = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 00000-0000',
    status: 'active',
    created_at: '2021-10-01',
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '(11) 00000-0000',
    status: 'inactive',
    created_at: '2021-10-01',
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro@example.com',
    phone: '(11) 00000-0000',
    status: 'active',
    created_at: '2021-10-01',
  },
]

const userDialogRef = ref<InstanceType<typeof UserDialog> | null>(null)
const deleteUserDialogRef = ref<InstanceType<typeof DeleteUserDialog> | null>(
  null,
)

const handleToggleDialog = () => {
  userDialogRef.value?.handleOpenDialog()
}

const handleNextPage = () => {
  currentPage.value++
}

const handlePrevPage = () => {
  currentPage.value--
}

const handlePage = (page: number) => {
  currentPage.value = page
}

const handleOrderBy = (key: string, direction: string) => {
  filters.value = { [key]: direction }
}

const handleEdit = (item: User) => {
  userDialogRef.value?.handleOpenDialog(item)
}

const handleDelete = (item: User) => {
  deleteUserDialogRef.value?.handleOpenDialog(item)
}

const usersTableData = computed<User[]>(
  () => (usersData.value as Response)?.users || mockedUserData,
)

const totalUsers = computed<number>(
  () =>
    (usersData.value as Response)?.pagination?.total || mockedUserData.length,
)
</script>

<template>
  <section
    class="bg-background flex max-w-[100vw] flex-col items-start justify-start overflow-auto p-5 sm:p-0! dark:bg-black"
  >
    <PageTitle class="mb-5" title="Usuários">
      <template #actions>
        <Button class="w-full" @click="handleToggleDialog">Novo usuário</Button>
      </template>
    </PageTitle>
    <UsersTable
      :data="usersTableData"
      :current-page="currentPage"
      :total="totalUsers"
      :is-loading="isLoadingUsers"
      @handle-order-by="handleOrderBy"
      @handle-edit="handleEdit"
      @handle-delete="handleDelete"
      @handle-next-page="handleNextPage"
      @handle-prev-page="handlePrevPage"
      @handle-page="handlePage"
    />
    <UserDialog ref="userDialogRef" />
    <DeleteUserDialog ref="deleteUserDialogRef" />
  </section>
</template>
