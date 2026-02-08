<script setup lang="ts">
import { offset, Placement, useFloating } from '@floating-ui/vue'
import {
  CalendarDate,
  DateFormatter,
  type DateValue,
  parseDate,
} from '@internationalized/date'
import { onClickOutside, useToggle } from '@vueuse/core'
import { format, isValid } from 'date-fns'
import { CalendarIcon, X } from 'lucide-vue-next'
import { toDate } from 'reka-ui/date'

import { Calendar } from '@/shared/components/calendar'
import { cn } from '@/lib/utils'

import Input from '../input/Input.vue'

const df = new DateFormatter('pt-BR', {
  dateStyle: 'short',
})

const props = defineProps<{
  modelValue?: string | Date
  placeholder?: string
  class?: string
  triggerClass?: string
  hasError?: boolean
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  readonly?: boolean
  name?: string
  align?: Placement
  onBlur?: (e: Event) => void
  onInput?: (e: Event | unknown) => void
  onChange?: (e: Event | unknown) => void
}>()

const emits = defineEmits(['update:modelValue'])

const [isOpen, toggleCalendar] = useToggle(false)
const wraperInputRef = ref(null)
const inputRef = ref()
const calendarRef = ref()
const inputValue = ref()

const computedAlign = computed(() => {
  return props.align || 'bottom-start'
})

const { floatingStyles } = useFloating(wraperInputRef, calendarRef, {
  placement: computedAlign,
  middleware: [offset(10)],
})

const value = computed<CalendarDate | undefined>({
  get: () => {
    if (!props.modelValue) return undefined
    if (typeof props.modelValue === 'string') {
      return props.modelValue.length === 10
        ? parseDate(props.modelValue)
        : undefined
    } else if (props.modelValue instanceof Date) {
      return toCalendarDate(props.modelValue)
    }
    return undefined
  },
  set: (val) => {
    return val
  },
})

const isValidDateInInput = computed(() => {
  const formatedDate = handleFormateDateToParse(inputValue.value)
  return inputValue.value?.length === 10 && isValid(new Date(formatedDate))
})

const handleFormateDateToParse = (value: string) => {
  const [day, month, year] = value.split('/')
  return `${year}-${month}-${day}`
}
const hadleDisplayDate = (value: CalendarDate) => df.format(toDate(value))

const toCalendarDate = (date?: Date): CalendarDate | undefined => {
  if (!date) return undefined

  const strDate = format(date, 'yyyy-MM-dd')

  if (!strDate) return new CalendarDate(1900, 1, 1)

  const [year, month, day] = strDate.split('-')

  const toNumber = (value: string, fallback: number): number =>
    value && !isNaN(Number(value)) ? Number(value) : fallback

  return new CalendarDate(
    toNumber(year, 1900),
    toNumber(month, 1),
    toNumber(day, 1),
  )
}

const handleUpdateDate = (v: DateValue | string) => {
  const date = v?.toString() || v
  emits('update:modelValue', date)
}

const handleFormatDisplayDate = () => {
  if (!props.modelValue) return undefined

  if (typeof props.modelValue === 'string') {
    return hadleDisplayDate(parseDate(props.modelValue))
  } else if (props.modelValue instanceof Date) {
    // @ts-expect-error: Argument of type 'string' is not assignable to parameter of type 'CalendarDate'
    return hadleDisplayDate(format(props.modelValue, 'dd/MM/yyyy'))
  }
}

const clearDateCalendar = () => {
  inputValue.value = ''
}

onClickOutside(calendarRef, () => toggleCalendar(false))

watch(
  () => isOpen.value,
  async (v) => {
    if (!v) return

    await nextTick()
    inputRef.value.handleFocus()
  },
)

watch(
  () => props.modelValue,
  () => {
    if (inputValue.value == props.modelValue) return

    if (!props.modelValue) {
      clearDateCalendar()
      return
    }

    if (
      typeof props.modelValue === 'string' &&
      props.modelValue.length === 10
    ) {
      inputValue.value = handleFormatDisplayDate()
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => inputValue.value,
  (newValue) => {
    const date = isValidDateInInput.value
      ? handleFormateDateToParse(newValue)
      : undefined

    let parsedDate = date ? parseDate(date) : inputValue.value

    const parsedAsDate = date && parsedDate ? toDate(parsedDate) : undefined

    if (props.minDate && parsedAsDate && parsedAsDate < props.minDate)
      parsedDate = parseDate(format(props.minDate, 'yyyy-MM-dd'))

    if (props.maxDate && parsedAsDate && parsedAsDate > props.maxDate)
      parsedDate = parseDate(format(props.maxDate, 'yyyy-MM-dd'))

    handleUpdateDate(parsedDate)
  },
)

watch(
  () => isOpen.value,
  (newValue) => {
    if (!newValue) return
    document.body.style.pointerEvents = 'unset'
  },
)
</script>

<template>
  <div :class="cn('relative', props.class)">
    <div ref="wraperInputRef" class="relative items-center">
      <Input
        ref="inputRef"
        v-model="inputValue"
        :class="cn('pr-8', props.triggerClass)"
        :readonly="props.readonly || props.disabled"
        :placeholder="placeholder"
        :has-error="hasError"
        date
        @click="!props.readonly && toggleCalendar(true)"
      />
      <span
        class="absolute inset-y-0 right-0 flex items-center justify-center px-2"
      >
        <X
          v-if="inputValue"
          class="ms-auto h-4 w-4 cursor-pointer opacity-50"
          @click="!props.readonly && !props.disabled && clearDateCalendar()"
        />
        <CalendarIcon
          v-else
          class="ms-auto h-4 w-4 opacity-50"
          @click="!props.readonly && !props.disabled && toggleCalendar(true)"
        />
      </span>
    </div>

    <Teleport to="body">
      <div v-if="isOpen" ref="calendarRef" class="z-99" :style="floatingStyles">
        <Calendar
          v-model="value"
          initial-focus
          class="rounded-md border bg-popover"
          :min-value="toCalendarDate(minDate)"
          :max-value="toCalendarDate(maxDate)"
          @update:model-value="handleUpdateDate($event)"
        />
      </div>
    </Teleport>
  </div>
</template>
