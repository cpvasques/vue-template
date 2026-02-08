<template>
    <Dialog v-model:open="isDialogOpen">
        <DialogContent class="border-border bg-background" hide-close>
            <DialogHeader class="sm:mb-2">
                <DialogTitle class="text-foreground flex items-center justify-between text-2xl font-semibold">
                    {{ isEditMode ? 'Editar evento' : 'Novo evento' }}
                    <DialogClose class="text-muted-foreground">
                        <X class="h-5 w-5" :stroke-width="1" />
                    </DialogClose>
                </DialogTitle>
                <DialogDescription class="text-muted-foreground text-left text-sm">
                    {{
                        isEditMode
                            ? 'Atualize as informações do evento e salve as alterações.'
                            : 'Preencha as informações abaixo para criar um novo evento'
                    }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="submitForm" class="grid grid-cols-12 gap-4">
                <FormField v-slot="{ componentField, errors }" name="title">
                    <FormItem class="col-span-12">
                        <FormLabel class="text-foreground text-sm font-medium">
                            Título do evento
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Digite o título do evento" v-bind="componentField"
                                :has-error="!!errors.length" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField, errors }" name="start">
                    <FormItem class="col-span-12 sm:col-span-6">
                        <FormLabel class="text-foreground text-sm font-medium">
                            Data de início
                        </FormLabel>
                        <FormControl>
                            <Input type="datetime-local" v-bind="componentField" :has-error="!!errors.length" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField, errors }" name="end">
                    <FormItem class="col-span-12 sm:col-span-6">
                        <FormLabel class="text-foreground text-sm font-medium">
                            Data de término
                        </FormLabel>
                        <FormControl>
                            <Input type="datetime-local" v-bind="componentField" :has-error="!!errors.length" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField, errors }" name="class">
                    <FormItem class="col-span-12 sm:col-span-6">
                        <FormLabel class="text-foreground text-sm font-medium">
                            Categoria
                        </FormLabel>
                        <FormControl>
                            <Select v-bind="componentField">
                                <SelectTrigger :has-error="!!errors.length">
                                    <SelectValue placeholder="Selecionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem v-for="eventClass in eventClasses" :key="eventClass.id"
                                            :value="eventClass.id">
                                            {{ eventClass.label }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ value, handleChange }" name="allDay">
                    <FormItem class="col-span-12 flex items-center gap-2 space-y-0 sm:col-span-6">
                        <FormControl>
                            <Checkbox :checked="value" @update:checked="handleChange" />
                        </FormControl>
                        <FormLabel class="text-foreground text-sm font-medium">
                            Dia inteiro
                        </FormLabel>
                    </FormItem>
                </FormField>

                <DialogFooter class="col-span-12 mt-2">
                    <div class="flex w-full items-center justify-between">
                        <Button v-if="isEditMode" type="button" variant="destructive" :disabled="isLoading"
                            @click="handleDeleteEvent">
                            Excluir
                        </Button>
                        <div v-else />
                        <div class="flex gap-2">
                            <Button type="button" variant="outline" :disabled="isLoading" @click="handleCloseDialog">
                                Cancelar
                            </Button>
                            <Button class="mb-2 sm:mt-0" type="submit" :disabled="isLoading">
                                Salvar
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/dialog'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/components/form'
import { Button } from '@/shared/components/button'
import { Checkbox } from '@/shared/components/checkbox'
import { Input } from '@/shared/components/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/select'
import { toTypedSchema } from '@vee-validate/zod'
import { X } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { type VueCalEvent } from 'vue-cal'
import { toast } from 'vue-sonner'

import {
    type EventFormValues,
    eventSchema,
} from '@/shared/components/events-calendar/model/eventSchema'

const emit = defineEmits<{
    (e: 'save:event', event: VueCalEvent): void
    (e: 'update:event', event: VueCalEvent): void
    (e: 'delete:event', event: VueCalEvent): void
}>()

const eventClasses = [
    { id: 'default', label: 'Padrão' },
    { id: 'meeting', label: 'Reunião' },
    { id: 'personal', label: 'Pessoal' },
    { id: 'important', label: 'Importante' },
]

const isDialogOpen = ref(false)
const isEditMode = ref(false)
const currentEvent = ref<VueCalEvent | null>(null)
const isLoading = ref(false)

const { handleSubmit, resetForm, setFieldValue } = useForm<EventFormValues>({
    validationSchema: toTypedSchema(eventSchema),
    validateOnMount: false,
    initialValues: {
        title: '',
        start: '',
        end: '',
        allDay: false,
        class: 'default',
    },
})

const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

const handleOpenDialog = (eventData?: Partial<VueCalEvent> | { start?: Date; end?: Date }) => {
    isDialogOpen.value = true

    // Normaliza as datas para garantir que são objetos Date
    const normalizeDate = (date: Date | string | undefined): Date => {
        if (!date) return new Date()
        if (date instanceof Date) return date
        return new Date(date)
    }

    // Se tem ID, é modo de edição
    if (eventData && eventData.event && eventData.event._.id) {
        isEditMode.value = true
        // As datas estão em eventData.event.start e eventData.event.end
        const startDate = normalizeDate(eventData.event.start)
        const endDate = normalizeDate(eventData.event.end)
        currentEvent.value = {
            id: eventData.event.id,
            title: eventData.event.title || '',
            start: startDate,
            end: endDate,
            allDay: eventData.event.allDay || false,
            class: (eventData.event.class as VueCalEvent['class']) || 'default',
        }
        setFieldValue('title', currentEvent.value.title)
        setFieldValue('start', formatDateForInput(currentEvent.value.start))
        setFieldValue('end', formatDateForInput(currentEvent.value.end))
        setFieldValue('allDay', currentEvent.value.allDay)
        setFieldValue('class', currentEvent.value.class)
    } else {
        // Modo de criação  
        isEditMode.value = false
        currentEvent.value = null

        const startDate = normalizeDate(eventData?.start)
        const endDate = eventData?.end
            ? normalizeDate(eventData.end)
            : new Date(startDate.getTime() + 60 * 60 * 1000)

        setFieldValue('title', '')
        setFieldValue('start', formatDateForInput(startDate))
        setFieldValue('end', formatDateForInput(endDate))
        setFieldValue('allDay', false)
        setFieldValue('class', 'default')
    }
}

const handleCloseDialog = () => {
    isDialogOpen.value = false
    isEditMode.value = false
    currentEvent.value = null
    resetForm()
}

const onSubmit = async (formValues: EventFormValues) => {
    if (!formValues) {
        toast.error('Preencha os campos corretamente')
        return
    }

    isLoading.value = true

    try {
        const eventPayload: VueCalEvent = {
            start: new Date(formValues.start),
            end: new Date(formValues.end),
            title: formValues.title,
            allDay: formValues.allDay,
            class: formValues.class as VueCalEvent['class'],
            id: currentEvent.value?.id || `new-event-${new Date().toISOString()}`,
        } as VueCalEvent

        if (isEditMode.value && currentEvent.value) {
            emit('update:event', eventPayload)
            toast.success('Evento atualizado com sucesso!')
        } else {
            emit('save:event', eventPayload)
            toast.success('Evento criado com sucesso!')
        }

        handleCloseDialog()
    } catch (error) {
        console.error('Erro ao salvar evento:', error)
        toast.error('Erro ao salvar evento')
    } finally {
        isLoading.value = false
    }
}

const submitForm = handleSubmit(onSubmit)

const handleDeleteEvent = () => {
    if (!currentEvent.value) return

    emit('delete:event', currentEvent.value)
    toast.success('Evento excluído com sucesso!')
    handleCloseDialog()
}

defineExpose({
    isDialogOpen,
    handleOpenDialog,
    handleCloseDialog,
})
</script>
