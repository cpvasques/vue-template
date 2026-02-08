<script setup lang="ts">
import { ChevronUp } from 'lucide-vue-next'

interface Props {
  columns: {
    key: string
    label: string
    sortable?: boolean
    headerClass?: string
    cellClass?: string
    headerHoverClass?: string
    rowHoverClass?: string
  }[]
  data: any[]
  selectable?: boolean
  selectableHeaderClass?: string
  selectableCellClass?: string
  headerHoverClass?: string
  rowHoverClass?: string
  checkboxClass?: string
  sortClass?: string
  noDataText?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selectableHeaderClass: '',
  selectableCellClass: '',
  headerHoverClass: 'hover:bg-secondary/50',
  rowHoverClass: 'hover:bg-secondary/50',
  checkboxClass: '',
  sortClass: '',
  noDataText: 'Nenhum dado encontrado',
})

const emit = defineEmits<{
  (e: 'order-by', key: string, direction: 'asc' | 'desc'): void
  (e: 'select', selectedItems: any[]): void
}>()

const sortKey = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('desc')
const selectedItems = ref<any[]>([])

const hasData = computed(() => {
  return props.data.length > 0
})

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'desc'
  }
  emit('order-by', key, sortDirection.value)
}

const handleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedItems.value = [...props.data]
  } else {
    selectedItems.value = []
  }
  emit('select', selectedItems.value)
}

const handleSelectItem = (checked: boolean, item: any) => {
  if (checked) {
    selectedItems.value.push(item)
  } else {
    const index = selectedItems.value.findIndex((i) => i === item)
    if (index !== -1) {
      selectedItems.value.splice(index, 1)
    }
  }
  emit('select', selectedItems.value)
}

const isAllSelected = computed(() => {
  return (
    props.data.length > 0 && selectedItems.value.length === props.data.length
  )
})

const getSortIconRotation = (columnKey: string) => {
  if (sortKey.value !== columnKey) return 180
  return sortDirection.value === 'asc' ? 0 : 180
}

const getColumnHeaderHoverClass = (column: any) => {
  return column.headerHoverClass || props.headerHoverClass
}
</script>

<template>
  <div class="w-full overflow-auto">
    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b">
          <th
            v-if="selectable"
            class="sticky left-0 z-10 bg-background p-4 text-left"
            :class="[selectableHeaderClass, headerHoverClass]"
          >
            <Checkbox
              :modelValue="isAllSelected"
              @update:modelValue="handleSelectAll"
              :class="checkboxClass"
            />
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
            class="cursor-pointer p-4 text-left"
            :class="[column.headerClass, getColumnHeaderHoverClass(column)]"
            @click="column.sortable && handleSort(column.key)"
          >
            <div class="flex items-center gap-2">
              {{ column.label }}
              <template v-if="column.sortable">
                <slot
                  name="sortIcon"
                  :column="column"
                  :is-active="sortKey === column.key"
                  :direction="sortDirection"
                  :rotation="getSortIconRotation(column.key)"
                >
                  <ChevronUp
                    class="h-4 w-4 transition-transform duration-200"
                    :class="[
                      {
                        'opacity-50': sortKey !== column.key,
                        'opacity-100': sortKey === column.key,
                      },
                      sortClass,
                    ]"
                    :style="{
                      transform: `rotate(${getSortIconRotation(column.key)}deg)`,
                    }"
                  />
                </slot>
              </template>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="hasData">
          <tr
            v-for="(item, index) in data"
            :key="index"
            class="hover-row border-b"
            :class="rowHoverClass"
          >
            <td
              v-if="selectable"
              class="left-0 z-10 bg-background p-4"
              :class="selectableCellClass"
            >
              <Checkbox
                :modelValue="selectedItems.includes(item)"
                @update:modelValue="
                  (checked) => handleSelectItem(checked as boolean, item)
                "
                :class="checkboxClass"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              class="p-4"
              :class="column.cellClass"
            >
              <slot :name="column.key" :item="item">
                {{ item[column.key] }}
              </slot>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="100%" class="p-4 pt-8 text-center">{{ noDataText }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.hover-row:hover td {
  background-color: inherit !important;
}
</style>
