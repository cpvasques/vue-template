<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

import { cn } from '@/app/utils/cn'
import { Button } from '@/shared/components/button'
import {
  Pagination,
  PaginationEllipsis,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/shared/components/pagination'

const props = defineProps({
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    required: true,
  },
  siblingCount: {
    type: Number,
    default: 1,
  },
  showEdges: {
    type: Boolean,
    default: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  prevText: {
    type: String,
    default: 'Anterior',
  },
  nextText: {
    type: String,
    default: 'Prox.',
  },
  buttonClass: {
    type: String,
    default:
      'w-28 border-0 shadow-none bg-background hover:bg-accent hover:text-accent-foreground',
  },
})

const currentPageLocal = ref<number>(props.currentPage)

const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage))

const cantNextPage = computed(() => currentPageLocal.value >= totalPages.value)

const cantPrevPage = computed(() => currentPageLocal.value <= 1)

const emit = defineEmits([
  'handle-next-page',
  'handle-prev-page',
  'handle-page',
  'handle-page-size',
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

watch(
  () => props.currentPage,
  (newValue) => {
    currentPageLocal.value = newValue
  },
)
</script>

<template>
  <Pagination
    v-slot="{ page }"
    v-model:page="currentPageLocal"
    class="mt-3"
    :items-per-page="itemsPerPage"
    :total="total"
    :sibling-count="siblingCount"
    :show-edges="showEdges"
    :default-page="currentPage"
  >
    <PaginationList
      v-slot="{ items }"
      class="ml-auto flex items-center justify-end gap-2"
    >
      <PaginationPrev
        :class="
          cn(
            'text-foreground hover:border-border hover:bg-accent hover:text-accent-foreground flex items-center p-2',
            cantPrevPage && 'opacity-50!',
            buttonClass,
          )
        "
        :disabled="cantPrevPage"
        @click="handlePrevPage"
      >
        <ChevronLeft class="h-4 w-4" />
        {{ prevText }}
      </PaginationPrev>

      <template v-for="(item, index) in items">
        <PaginationListItem
          v-if="item.type === 'page'"
          :key="index"
          :value="item.value"
          as-child
        >
          <Button
            class="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground h-9 w-9 border p-0"
            :variant="item.value === page ? 'default' : 'outline'"
            @click="handlePage(item.value)"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          class="mt-2 h-4 w-4"
          :key="item.type"
          :index="index"
        />
      </template>

      <PaginationNext
        :class="
          cn(
            'text-foreground hover:border-border hover:bg-accent hover:text-accent-foreground flex items-center p-2',
            cantNextPage && 'opacity-50!',
            buttonClass,
          )
        "
        :disabled="cantNextPage"
        @click="handleNextPage"
      >
        {{ nextText }}
        <ChevronRight class="h-4 w-4" />
      </PaginationNext>
    </PaginationList>
  </Pagination>
</template>
