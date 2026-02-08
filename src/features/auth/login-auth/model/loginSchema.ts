import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string({ message: 'E-mail é obrigatório.' })
      .min(1, { message: 'E-mail é obrigatório.' })
      .email({ message: 'E-mail deve ser válido.' }),
    password: z
      .string({ message: 'Senha é obrigatória.' })
      .min(1, { message: 'Senha é obrigatória.' }),
  }),
)
