<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/select'

import { CalendarView } from './model'

const props = defineProps<{
    modelValue: CalendarView,
}>()

const emit = defineEmits<{
    'update:modelValue': [value: CalendarView]
}>()

const views = [
    { value: CalendarView.DAY, label: 'Dia' },
    { value: CalendarView.DAYS, label: 'Dias' },
    { value: CalendarView.WEEK, label: 'Semana' },
    { value: CalendarView.MONTH, label: 'Mês' },
    { value: CalendarView.YEAR, label: 'Ano' },
    { value: CalendarView.YEARS, label: 'Anos' },
]

const selectedViewLabel = computed(() => {
    return views.find((view) => view.value === props.modelValue)?.label || 'Selecione'
})

function handleUpdate(value: string | number) {
    emit('update:modelValue', value as CalendarView)
}
</script>

<template>
    <div class="mb-4">
        <Select :model-value="modelValue" @update:model-value="handleUpdate">
            <SelectTrigger class="w-[180px]">
                <SelectValue :placeholder="selectedViewLabel">
                    {{ selectedViewLabel }}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem v-for="view in views" :key="view.value" :value="view.value">
                        {{ view.label }}
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
</template>
