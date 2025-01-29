import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { passwordRegex } from '@/utils/passwordRegex'

export const formSchema = toTypedSchema(
  z.object({
    email: z.string().email({ message: 'E-mail inválido' }),
    password: z
      .string({ message: 'Senha é obrigatória.' })
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
      .regex(passwordRegex, {
        message:
          'A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.',
      }),
  }),
)
