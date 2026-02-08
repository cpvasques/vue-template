<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { CalendarDate, parseDate } from '@internationalized/date'
import { format, Locale } from 'date-fns'
import { de, enUS, es, fr, ptBR } from 'date-fns/locale'
import { X } from 'lucide-vue-next'
import {
  DateRangePickerArrow,
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerInput,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot,
  DateRangePickerTrigger,
} from 'reka-ui'
import { toDate } from 'reka-ui/date'
import { reactive } from 'vue'

interface DateRange {
  start?: Date | string | undefined
  end?: Date | string | undefined
}

interface Props {
  modelValue?: DateRange
  locale?: string
  placeholder?: string
  class?: string
  disabled?: boolean
  readonly?: boolean
  name?: string
  isDateUnavailable?: (date: any) => boolean
  containerClass?: string
  hasError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'pt-BR',
  placeholder: 'Selecione o período',
  hasError: false,
})

const emits = defineEmits<{
  'update:modelValue': [value: DateRange | undefined]
}>()

// Função para converter Date para CalendarDate
const toCalendarDate = (date?: Date | string): CalendarDate | undefined => {
  if (!date) return undefined

  if (typeof date === 'string') {
    // Se for string no formato YYYY-MM-DD, usar parseDate
    if (date.length === 10 && date.includes('-')) {
      return parseDate(date)
    }
    // Se for string em outro formato, converter para Date primeiro
    date = new Date(date)
  }

  if (date instanceof Date && !isNaN(date.getTime())) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return new CalendarDate(year, month, day)
  }

  return undefined
}

// Valor interno reativo para o reka-ui
const dateRangeValue = ref()

// Sincronizar valor interno com prop modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      dateRangeValue.value = undefined
      return
    }

    const start = toCalendarDate(newValue.start)
    const end = toCalendarDate(newValue.end)

    // Criar objeto reativo para o reka-ui
    dateRangeValue.value = reactive({
      start,
      end,
    })
  },
  { immediate: true },
)

const hasValue = computed(() => {
  return (
    dateRangeValue.value &&
    (dateRangeValue.value.start || dateRangeValue.value.end)
  )
})

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const formatDate = (date: any) => {
  if (!date) return ''

  try {
    // Verificar se é um CalendarDate do reka-ui
    let dateObj

    if (date.toDate && typeof date.toDate === 'function') {
      dateObj = date.toDate()
    } else if (date.toString) {
      dateObj = new Date(date.toString())
    } else {
      dateObj = new Date(date)
    }

    // Verificar se a data é válida
    if (
      !dateObj ||
      dateObj.toString() === 'Invalid Date' ||
      isNaN(dateObj.getTime())
    ) {
      return ''
    }

    // Mapear string locale para objeto Locale do date-fns
    const localeMap: Record<string, Locale> = {
      'pt-BR': ptBR,
      'en-US': enUS,
      'es-ES': es,
      'fr-FR': fr,
      'de-DE': de,
    }

    const locale = localeMap[props.locale] || ptBR

    const formattedDate = format(dateObj, 'MMM dd, yyyy', { locale })

    return capitalizeFirst(formattedDate)
  } catch (error) {
    console.warn('Erro ao formatar data:', error)
    return ''
  }
}

const displayValue = computed(() => {
  if (!hasValue.value) return ''

  const start = dateRangeValue.value?.start
    ? formatDate(dateRangeValue.value.start)
    : ''
  const end = dateRangeValue.value?.end
    ? formatDate(dateRangeValue.value.end)
    : ''

  if (start && end) return `${start} - ${end}`
  if (start) return start
  if (end) return end

  return ''
})

const handleUpdateValue = (value: any) => {
  // Atualizar o valor interno primeiro
  if (!value) {
    dateRangeValue.value = undefined
    emits('update:modelValue', undefined)
    return
  }

  // Criar objeto reativo para manter consistência
  dateRangeValue.value = reactive({
    start: value.start,
    end: value.end,
  })

  // Converter CalendarDate para Date ao emitir
  const convertedValue: DateRange = {
    start: value.start ? toDate(value.start) : undefined,
    end: value.end ? toDate(value.end) : undefined,
  }

  emits('update:modelValue', convertedValue)
}

const clearDateRange = () => {
  dateRangeValue.value = undefined
  emits('update:modelValue', undefined)
}
</script>

<template>
  <div :class="props.containerClass">
    <DateRangePickerRoot
      v-model="dateRangeValue"
      :locale="props.locale"
      :is-date-unavailable="props.isDateUnavailable"
      @update:model-value="handleUpdateValue"
      class="relative"
    >
      <DateRangePickerField
        v-slot="{ segments }"
        :class="[
          'relative flex select-none items-center rounded-md border bg-background text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-destructive',
          props.class,
          {
            'cursor-not-allowed opacity-50': props.disabled,
            'cursor-not-allowed': props.readonly,
            'border-destructive focus-within:ring-2 focus-within:ring-destructive focus-within:ring-offset-2':
              props.hasError,
            'border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2':
              !props.hasError,
          },
        ]"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :name="props.name"
      >
        <input
          :value="displayValue"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          :readonly="true"
          class="flex-1 bg-transparent px-3 py-2 placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
        />

        <div class="pointer-events-none absolute opacity-0">
          <template v-for="item in segments.start" :key="item.part">
            <DateRangePickerInput :part="item.part" type="start">
              {{ item.value }}
            </DateRangePickerInput>
          </template>
          <template v-for="item in segments.end" :key="item.part">
            <DateRangePickerInput :part="item.part" type="end">
              {{ item.value }}
            </DateRangePickerInput>
          </template>
        </div>

        <DateRangePickerTrigger
          :disabled="props.disabled || props.readonly"
          class="mr-3 inline-flex h-4 w-4 items-center justify-center opacity-50 hover:opacity-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-25"
        >
          <X
            v-if="hasValue"
            class="h-4 w-4 cursor-pointer"
            @click.stop="!props.readonly && !props.disabled && clearDateRange()"
          />
          <Icon v-else icon="radix-icons:calendar" class="h-4 w-4" />
        </DateRangePickerTrigger>
      </DateRangePickerField>

      <DateRangePickerContent
        side="bottom"
        align="center"
        :side-offset="4"
        class="z-50 rounded-md border bg-popover shadow-sm"
      >
        <DateRangePickerArrow class="fill-white stroke-gray-300" />
        <DateRangePickerCalendar v-slot="{ weekDays, grid }" class="p-3">
          <DateRangePickerHeader
            class="relative flex w-full items-center justify-between pt-1"
          >
            <DateRangePickerPrev
              class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-transparent opacity-50 hover:opacity-100"
            >
              <Icon icon="radix-icons:chevron-left" class="h-4 w-4" />
            </DateRangePickerPrev>

            <DateRangePickerHeading class="text-sm font-medium" />
            <DateRangePickerNext
              class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-transparent opacity-50 hover:opacity-100"
            >
              <Icon icon="radix-icons:chevron-right" class="h-4 w-4" />
            </DateRangePickerNext>
          </DateRangePickerHeader>
          <div
            class="mt-4 flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0"
          >
            <DateRangePickerGrid
              v-for="month in grid"
              :key="month.value.toString()"
            >
              <DateRangePickerGridHead>
                <DateRangePickerGridRow>
                  <DateRangePickerHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground"
                  >
                    {{ day }}
                  </DateRangePickerHeadCell>
                </DateRangePickerGridRow>
              </DateRangePickerGridHead>
              <DateRangePickerGridBody>
                <DateRangePickerGridRow
                  v-for="(weekDates, index) in month.rows"
                  :key="`weekDate-${index}`"
                  class="mt-2 w-full"
                >
                  <DateRangePickerCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                  >
                    <DateRangePickerCellTrigger
                      :day="weekDate"
                      :month="month.value"
                      class="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 aria-selected:opacity-100 data-highlighted:bg-accent data-selected:bg-primary data-today:bg-accent data-disabled:text-muted-foreground data-highlighted:text-accent-foreground data-outside-view:text-muted-foreground data-selected:text-primary-foreground data-today:text-accent-foreground data-unavailable:text-destructive-foreground data-unavailable:line-through data-disabled:opacity-50 data-outside-view:opacity-50 data-selected:opacity-100 data-selected:hover:bg-primary data-selected:hover:text-primary-foreground data-selected:focus:bg-primary data-selected:focus:text-primary-foreground [&[data-outside-view][data-selected]]:bg-accent/50 [&[data-outside-view][data-selected]]:text-muted-foreground [&[data-outside-view][data-selected]]:opacity-30"
                    />
                  </DateRangePickerCell>
                </DateRangePickerGridRow>
              </DateRangePickerGridBody>
            </DateRangePickerGrid>
          </div>
        </DateRangePickerCalendar>
      </DateRangePickerContent>
    </DateRangePickerRoot>
  </div>
</template>
