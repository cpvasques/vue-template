import { z } from 'zod'

export const eventSchema = z
  .object({
    title: z.string().min(1, 'Título é obrigatório'),
    start: z.string().min(1, 'Data de início é obrigatória'),
    end: z.string().min(1, 'Data de término é obrigatória'),
    allDay: z.boolean().default(false),
    class: z
      .enum(['default', 'meeting', 'personal', 'important'])
      .default('default'),
  })
  .refine(
    (data) => {
      const start = new Date(data.start)
      const end = new Date(data.end)
      return end >= start
    },
    {
      message: 'Data de término deve ser posterior à data de início',
      path: ['end'],
    },
  )

export type EventFormValues = z.infer<typeof eventSchema>
