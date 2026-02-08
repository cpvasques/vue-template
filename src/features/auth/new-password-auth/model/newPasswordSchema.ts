import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { passwordRegex } from '@/app/utils/passwordRegex'

export const newPasswordSchema = toTypedSchema(
  z
    .object({
      password: z
        .string({ message: 'Senha é obrigatório.' })
        .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
        .regex(passwordRegex, {
          message: 'A senha deve seguir as regras de segurança.',
        }),
      confirmPassword: z
        .string({ message: 'Confirme sua senha.' })
        .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
        .regex(passwordRegex, {
          message: 'A senha deve seguir as regras de segurança.',
        }),
    })
    .superRefine((values, ctx) => {
      const { password, confirmPassword } = values

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: 'As senhas precisam ser iguais.',
        })
      }
    }),
)
