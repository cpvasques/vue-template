import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const recoverPasswordSchema = toTypedSchema(
  z.object({
    email: z
      .string({ message: 'E-mail é obrigatório.' })
      .email({ message: 'E-mail deve ser válido.' }),
  }),
)
