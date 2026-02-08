<script setup lang="ts">
import { Skeleton } from '@/shared/components/skeleton'
import { cn } from '@/lib/utils'

interface Column {
  key: string
  label: string
  headerClass?: string
  cellClass?: string
}

defineProps<{
  columns: Column[]
  rows: number
}>()
</script>

<template>
  <div class="w-full overflow-auto rounded-lg border border-gray-200">
    <table class="w-full">
      <thead class="border-b border-gray-200">
        <tr>
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
        <tr
          v-for="index in rows"
          :key="index"
          class="h-14 border-b border-gray-200"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="cn('p-4', column.cellClass)"
          >
            <Skeleton class="h-5 rounded-full bg-gray-200" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
