<template>
    <VueCal v-bind="mergedProps" :view="activeView" ref="calendarRef" :events="events">
        <template v-if="$slots.title" v-slot:title="slotProps">
            <slot name="title" v-bind="slotProps" />
        </template>
        <template v-if="$slots['title.day']" v-slot:[`title.day`]="slotProps">
            <slot name="title.day" v-bind="slotProps" />
        </template>
        <template v-if="$slots['title.days']" v-slot:[`title.days`]="slotProps">
            <slot name="title.days" v-bind="slotProps" />
        </template>
        <template v-if="$slots['title.week']" v-slot:[`title.week`]="slotProps">
            <slot name="title.week" v-bind="slotProps" />
        </template>
        <template v-if="$slots['title.month']" v-slot:[`title.month`]="slotProps">
            <slot name="title.month" v-bind="slotProps" />
        </template>
        <template v-if="$slots['title.year']" v-slot:[`title.year`]="slotProps">
            <slot name="title.year" v-bind="slotProps" />
        </template>
        <template v-if="$slots['title.years']" v-slot:[`title.years`]="slotProps">
            <slot name="title.years" v-bind="slotProps" />
        </template>

        <template v-if="$slots['previous-button']" v-slot:[`previous-button`]="slotProps">
            <slot name="previous-button" v-bind="slotProps" />
        </template>
        <template v-if="$slots['next-button']" v-slot:[`next-button`]="slotProps">
            <slot name="next-button" v-bind="slotProps" />
        </template>
        <template v-if="$slots['today-button']" v-slot:[`today-button`]="slotProps">
            <slot name="today-button" v-bind="slotProps" />
        </template>

        <template v-if="$slots['weekday-heading']" v-slot:[`weekday-heading`]="slotProps">
            <slot name="weekday-heading" v-bind="slotProps" />
        </template>
        <template v-if="$slots['schedule-heading']" v-slot:[`schedule-heading`]="slotProps">
            <slot name="schedule-heading" v-bind="slotProps" />
        </template>

        <template v-if="$slots['time-cell']" v-slot:[`time-cell`]="slotProps">
            <slot name="time-cell" v-bind="slotProps" />
        </template>
        <template v-if="$slots['week-number-cell']" v-slot:[`week-number-cell`]="slotProps">
            <slot name="week-number-cell" v-bind="slotProps" />
        </template>
        <template v-if="$slots.cell" v-slot:cell="slotProps">
            <slot name="cell" v-bind="slotProps" />
        </template>
        <template v-if="$slots['cell-content']" v-slot:[`cell-content`]="slotProps">
            <slot name="cell-content" v-bind="slotProps" />
        </template>
        <template v-if="$slots['cell-events']" v-slot:[`cell-events`]="slotProps">
            <slot name="cell-events" v-bind="slotProps" />
        </template>

        <template v-if="$slots.event" v-slot:event="slotProps">
            <slot name="event" v-bind="slotProps" />
        </template>
        <template v-if="$slots['event.all-day']" v-slot:[`event.all-day`]="slotProps">
            <slot name="event.all-day" v-bind="slotProps" />
        </template>
        <template v-if="$slots['event.day']" v-slot:[`event.day`]="slotProps">
            <slot name="event.day" v-bind="slotProps" />
        </template>
        <template v-if="$slots['event.days']" v-slot:[`event.days`]="slotProps">
            <slot name="event.days" v-bind="slotProps" />
        </template>
        <template v-if="$slots['event.week']" v-slot:[`event.week`]="slotProps">
            <slot name="event.week" v-bind="slotProps" />
        </template>
        <template v-if="$slots['event.month']" v-slot:[`event.month`]="slotProps">
            <slot name="event.month" v-bind="slotProps" />
        </template>
        <template v-if="$slots['event.year']" v-slot:[`event.year`]="slotProps">
            <slot name="event.year" v-bind="slotProps" />
        </template>
        <template v-if="$slots['event.years']" v-slot:[`event.years`]="slotProps">
            <slot name="event.years" v-bind="slotProps" />
        </template>

        <template v-if="$slots['events-count']" v-slot:[`events-count`]="slotProps">
            <slot name="events-count" v-bind="slotProps" />
        </template>

        <template v-if="$slots.diy" v-slot:diy="slotProps">
            <slot name="diy" v-bind="slotProps" />
        </template>
    </VueCal>
</template>

<script setup lang="ts">
import 'vue-cal/style.css'

import { computed, ref, useAttrs, watch } from 'vue'
import {
    VueCal,
    type VueCalConfig,
    type VueCalEvent,
} from 'vue-cal'

import { CalendarView } from './model'

defineOptions({
    inheritAttrs: false,
})

const props = defineProps<{
    options: VueCalConfig,
    activeView: CalendarView,
    events: VueCalEvent[]
}>()
const attrs = useAttrs()

const mergedProps = computed(() => ({
    ...props.options,
    ...attrs,
}))

const calendarRef = ref<InstanceType<typeof VueCal> | null>(null)

defineExpose({
    calendarRef,
})
</script>

<style>
@media screen and (max-width: 768px) {
    .vuecal__body-wrap {
        min-width: 1000px !important;
    }
}
</style>