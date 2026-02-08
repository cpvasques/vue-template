<script setup lang="ts">
import { cn } from '@/lib/utils'

import { Skeleton } from '../skeleton'

interface Column {
  key: string
  label: string
  headerClass?: string
  cellClass?: string
}

withDefaults(
  defineProps<{
    columns?: Column[]
    rows?: number
    tableContainerClass?: string
    tableClass?: string
    headerContainerClass?: string
    bodyContainerClass?: string
    skeletonClass?: string
  }>(),
  {
    columns: () => [
      { key: 'col1', label: '' },
      { key: 'col2', label: '' },
      { key: 'col3', label: '' },
    ],
    rows: 5,
  },
)
</script>

<template>
  <div
    :class="cn('w-full overflow-auto rounded-lg border', tableContainerClass)"
  >
    <table :class="cn('w-full border-collapse', tableClass)">
      <thead>
        <tr :class="cn(headerContainerClass)">
          <th
            v-for="column in columns"
            :key="column.key"
            :class="
              cn(
                'p-4 text-left text-sm font-medium text-gray-500',
                column.headerClass,
              )
            "
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="index in rows" :key="index" :class="cn(bodyContainerClass)">
          <td
            v-for="column in columns"
            :key="column.key"
            :class="cn('p-4', column.cellClass)"
          >
            <Skeleton
              :class="cn('h-5 rounded-full bg-gray-200', skeletonClass)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
