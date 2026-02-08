import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const postNewUserSchema = toTypedSchema(
  z.object({
    name: z
      .string({ message: 'Nome é obrigatório.' })
      .min(1, { message: 'Nome é obrigatório.' }),
    email: z
      .string({ message: 'E-mail é obrigatório.' })
      .min(1, { message: 'E-mail é obrigatório.' })
      .email({ message: 'E-mail deve ser válido.' }),
    phone: z
      .string({ message: 'Telefone é obrigatório.' })
      .min(14, { message: 'Telefone inválido.' }),
    status: z.string({ message: 'Status é obrigatório.' }),
  }),
)
