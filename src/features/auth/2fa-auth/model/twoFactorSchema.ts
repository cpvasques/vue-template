import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const twoFactorSchema = toTypedSchema(
  z.object({
    token: z
      .string({ message: 'O código é obrigatório.' })
      .length(6, 'O código deve ter 6 dígitos'),
  }),
)
