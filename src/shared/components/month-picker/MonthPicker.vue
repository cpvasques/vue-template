<script setup lang="ts">
import { offset, Placement, useFloating } from '@floating-ui/vue'
import { CalendarDate } from '@internationalized/date'
import { onClickOutside, useToggle } from '@vueuse/core'
import { CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarHeader,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui'
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'

import { Input } from '@/shared/components/input'
import { cn } from '@/lib/utils'

const props = defineProps<{
  modelValue?: {
    start: { year: number; month: number }
    end: { year: number; month: number }
  }
  placeholder?: string
  class?: string
  triggerClass?: string
  hasError?: boolean
  disabled?: boolean
  readonly?: boolean
  selectedCellClass?: string
  hoverCellClass?: string
  rangeCellClass?: string
  cellBorderClass?: string
  align?: Placement
  floating?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const [isOpen, toggleOpen] = useToggle(false)
const wraperInputRef = ref<HTMLDivElement | null>(null)
const inputRef = ref()
const calendarRef = ref()
const inputValue = ref('')

const computedAlign = computed(() => {
  return props.align || 'bottom-start'
})

const { floatingStyles } = useFloating(wraperInputRef, calendarRef, {
  placement: computedAlign,
  strategy: props.floating ? 'fixed' : 'absolute',
  middleware: [offset(10)],
})

const calendarStyles = ref<CSSProperties>({})

watch(
  floatingStyles,
  () => {
    calendarStyles.value = {
      ...floatingStyles.value,
      minWidth: '280px',
    }
  },
  { deep: true },
)

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const currentYear = ref(
  props.modelValue?.start?.year || new Date().getFullYear(),
)
const selectedStart = ref<{ year: number; month: number } | null>(null)
const selectedEnd = ref<{ year: number; month: number } | null>(null)
const hoveredMonthIdx = ref<number | null>(null)

const displayValue = computed(() => {
  const start = props.modelValue?.start
  const end = props.modelValue?.end

  if (!start || !end) return ''

  const sameYear = start.year === end.year
  const sameMonth = start.month === end.month

  if (sameYear && sameMonth) {
    return `${months[start.month - 1]}/${start.year}`
  }

  if (sameYear) {
    return `${months[start.month - 1]} - ${months[end.month - 1]}/${start.year}`
  }

  return `${months[start.month - 1]}/${start.year} - ${months[end.month - 1]}/${end.year}`
})

const getCellClasses = computed(() => {
  return (idx: number) => {
    const start = selectedStart.value
    const end = selectedEnd.value
    const hovered = hoveredMonthIdx.value
    const year = currentYear.value
    const month = idx + 1

    const isHoveredValid = hovered !== undefined && hovered !== null
    const isSelected =
      (start?.year === year && start?.month === month) ||
      (end?.year === year && end?.month === month) ||
      (isHoveredValid && hovered === idx && start?.year === year)

    const isInRange = (() => {
      if (!start) return false

      const isEndSelected = !!end
      const isCurrentCellSelected =
        (start?.year === year && start?.month === month) ||
        (end?.year === year && end?.month === month)

      if (
        (isEndSelected && !isCurrentCellSelected) ||
        (!isEndSelected && isHoveredValid && hovered !== idx)
      ) {
        if (year === start.year && (!end || year === end.year)) {
          const dataAtual = new Date(year, idx)
          const dataInicio = new Date(start.year, start.month - 1)
          const dataFim = end
            ? new Date(end.year, end.month - 1)
            : new Date(year, hovered as number)

          if (dataFim >= dataInicio) {
            return dataAtual > dataInicio && dataAtual < dataFim
          } else {
            return dataAtual < dataInicio && dataAtual > dataFim
          }
        }
      }
      return false
    })()

    return cn('relative rounded-md text-center text-sm', {
      [props.selectedCellClass ||
      'bg-accent-foreground text-accent hover:bg-accent hover:text-accent-foreground']:
        isSelected,
      [props.rangeCellClass || 'bg-primary/40 text-primary-foreground']:
        isInRange,
    })
  }
})

function prevYear() {
  currentYear.value--
}

function nextYear() {
  currentYear.value++
}

function selectMonth(monthIndex: number) {
  const novoMes = { year: currentYear.value, month: monthIndex + 1 }

  if (!selectedStart.value) {
    selectedStart.value = novoMes
    return
  }

  if (!selectedEnd.value) {
    const startDate = new Date(
      selectedStart.value.year,
      selectedStart.value.month - 1,
    )
    const endDate = new Date(novoMes.year, novoMes.month - 1)

    if (endDate < startDate) return

    selectedEnd.value = novoMes

    emit('update:modelValue', {
      start: { ...selectedStart.value },
      end: { ...selectedEnd.value },
    })
    toggleOpen(false)
    return
  }

  selectedStart.value = novoMes
  selectedEnd.value = null
}

function selectAllYear() {
  emit('update:modelValue', {
    start: { year: currentYear.value, month: 1 },
    end: { year: currentYear.value, month: 12 },
  })
  toggleOpen(false)
}

function clearMonth() {
  emit('update:modelValue', undefined)
  inputValue.value = ''
  selectedStart.value = null
  selectedEnd.value = null
}

onClickOutside(calendarRef, () => toggleOpen(false))

watch(
  () => props.modelValue,
  () => {
    if (inputValue.value === displayValue.value) return

    if (!props.modelValue) {
      inputValue.value = ''
    } else {
      inputValue.value = displayValue.value
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div :class="cn('relative rounded-md', props.class)" ref="wraperInputRef">
    <div class="relative items-center">
      <Input
        ref="inputRef"
        v-model="inputValue"
        :class="cn('pr-8', props.triggerClass)"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :placeholder="props.placeholder"
        :has-error="props.hasError"
        @click="!props.readonly && !props.disabled && toggleOpen(true)"
      />
      <span
        class="absolute inset-y-0 right-0 flex items-center justify-center px-2"
      >
        <X
          v-if="inputValue"
          class="ms-auto h-4 w-4 cursor-pointer opacity-50"
          @click="!props.readonly && !props.disabled && clearMonth()"
        />
        <CalendarIcon
          v-else
          class="ms-auto h-4 w-4 opacity-50"
          @click="!props.readonly && !props.disabled && toggleOpen(true)"
        />
      </span>
    </div>

    <Teleport v-if="props.floating" to="body">
      <div v-if="isOpen" ref="calendarRef" class="z-50" :style="calendarStyles">
        <CalendarRoot
          :class="cn('w-full rounded-xl border bg-background p-4 shadow-sm')"
        >
          <CalendarHeader class="flex items-center justify-between">
            <CalendarPrev
              as="button"
              @click="prevYear"
              class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-center hover:bg-accent"
            >
              <ChevronLeft class="h-4 w-4" />
            </CalendarPrev>
            <span class="text-sm font-medium">{{ currentYear }}</span>
            <CalendarNext
              as="button"
              @click="nextYear"
              class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-center hover:bg-accent"
            >
              <ChevronRight class="h-4 w-4" />
            </CalendarNext>
          </CalendarHeader>
          <div class="grid grid-cols-3 gap-2.5 pt-4">
            <div
              class="col-span-3 cursor-pointer rounded-md border border-accent p-2 text-center hover:bg-accent"
              @click="selectAllYear"
            >
              <span class="text-sm">Ano todo</span>
            </div>
            <CalendarCell
              v-for="(month, idx) in months"
              :key="month"
              :date="new CalendarDate(currentYear, idx + 1, 1)"
              :class="getCellClasses(idx)"
              @mouseenter="
                () => {
                  hoveredMonthIdx = idx
                }
              "
              @mouseleave="
                () => {
                  hoveredMonthIdx = null
                }
              "
            >
              <CalendarCellTrigger
                :day="new CalendarDate(currentYear, idx + 1, 1)"
                :month="new CalendarDate(currentYear, idx + 1, 1)"
                @click="selectMonth(idx)"
                :class="
                  cn(
                    'w-full rounded-md px-1 py-2',
                    props.cellBorderClass ||
                      'border border-accent hover:bg-accent',
                  )
                "
              >
                {{ month }}
              </CalendarCellTrigger>
            </CalendarCell>
          </div>
        </CalendarRoot>
      </div>
    </Teleport>

    <div
      v-else-if="isOpen"
      ref="calendarRef"
      class="z-50"
      :style="calendarStyles"
    >
      <CalendarRoot
        :class="cn('w-full rounded-xl border bg-background p-4 shadow-sm')"
      >
        <CalendarHeader class="flex items-center justify-between">
          <CalendarPrev
            as="button"
            @click="prevYear"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-center hover:bg-accent"
          >
            <ChevronLeft class="h-4 w-4" />
          </CalendarPrev>
          <span class="text-sm font-medium">{{ currentYear }}</span>
          <CalendarNext
            as="button"
            @click="nextYear"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-center hover:bg-accent"
          >
            <ChevronRight class="h-4 w-4" />
          </CalendarNext>
        </CalendarHeader>
        <div class="grid grid-cols-3 gap-2.5 pt-4">
          <div
            class="col-span-3 cursor-pointer rounded-md border border-accent p-2 text-center hover:bg-accent"
            @click="selectAllYear"
          >
            <span class="text-sm">Ano todo</span>
          </div>
          <CalendarCell
            v-for="(month, idx) in months"
            :key="month"
            :date="new CalendarDate(currentYear, idx + 1, 1)"
            :class="getCellClasses(idx)"
            @mouseenter="
              () => {
                hoveredMonthIdx = idx
              }
            "
            @mouseleave="
              () => {
                hoveredMonthIdx = null
              }
            "
          >
            <CalendarCellTrigger
              :day="new CalendarDate(currentYear, idx + 1, 1)"
              :month="new CalendarDate(currentYear, idx + 1, 1)"
              @click="selectMonth(idx)"
              :class="
                cn(
                  'w-full rounded-md px-1 py-2',
                  props.cellBorderClass ||
                    'border border-accent hover:bg-accent',
                )
              "
            >
              {{ month }}
            </CalendarCellTrigger>
          </CalendarCell>
        </div>
      </CalendarRoot>
    </div>
  </div>
</template>
