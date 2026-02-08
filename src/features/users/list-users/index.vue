<script setup lang="ts">
import { Badge } from '@/shared/components/badge'
import { Button } from '@/shared/components/button'
import { DataTable } from '@/shared/components/data-table'
import { format } from 'date-fns'
import { ArrowDownUp, SquarePen, Trash2 } from 'lucide-vue-next'

import Pagination from '@/widgets/pagination/index.vue'

import { usersTableColumns } from './model/columns'

defineProps({
  data: {
    type: Array as PropType<any[]>,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits([
  'handle-next-page',
  'handle-prev-page',
  'handle-page',
  'handle-order-by',
  'handle-edit',
  'handle-delete',
])

const handleNextPage = () => {
  emit('handle-next-page')
}

const handlePrevPage = () => {
  emit('handle-prev-page')
}

const handlePage = (page: number) => {
  emit('handle-page', page)
}

const handleOrderBy = (key: string, direction: 'asc' | 'desc') => {
  emit('handle-order-by', key, direction)
}

const handleEdit = (item: any) => {
  emit('handle-edit', item)
}

const handleDelete = (item: any) => {
  emit('handle-delete', item)
}
</script>

<template>
  <div class="w-full">
    <div class="border-border w-full rounded-lg border border-b-0!">
      <DataTable
        class="[&_td]:border-border [&_th]:border-border rounded-lg [&_td]:border-b [&_th]:border-b"
        :columns="usersTableColumns"
        :data="data"
        @order-by="handleOrderBy"
      >
        <template #sortIcon="{ isActive }">
          <ArrowDownUp
            class="text-muted-foreground ml-auto h-4 w-4"
            :class="{ 'text-primary!': isActive }"
            :stroke-width="isActive ? 2 : 1"
          />
        </template>

        <template #name="{ item }">
          {{ item.name }}
        </template>

        <template #created_at="{ item }">
          {{ format(item.created_at, 'dd/MM/yyyy') || '' }}
        </template>

        <template #status="{ item }">
          <Badge
            :variant="item.status === 'active' ? 'success' : 'destructive'"
          >
            {{ item.status === 'active' ? 'Ativo' : 'Inativo' }}
          </Badge>
        </template>

        <template #actions="{ item }">
          <div class="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              class="h-4 w-4 p-0"
              @click="handleEdit(item)"
            >
              <SquarePen class="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              class="h-4 w-4 p-0"
              @click="handleDelete(item)"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </template>
      </DataTable>
    </div>

    <Pagination
      button-class="w-auto border-none shadow-none bg-background"
      :items-per-page="10"
      :total="total"
      :sibling-count="1"
      :show-edges="true"
      :current-page="currentPage"
      prev-text="Anterior"
      next-text="Próx."
      @handle-next-page="handleNextPage"
      @handle-prev-page="handlePrevPage"
      @handle-page="handlePage"
    />
  </div>
</template>
