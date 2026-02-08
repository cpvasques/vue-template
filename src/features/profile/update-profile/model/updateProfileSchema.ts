import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const updateProfileSchema = toTypedSchema(
  z.object({
    name: z
      .string({ message: 'Nome é obrigatório.' })
      .min(1, { message: 'Nome é obrigatório.' }),
    surname: z
      .string({ message: 'Sobrenome é obrigatório.' })
      .min(1, { message: 'Sobrenome é obrigatório.' }),
    email: z
      .string({ message: 'E-mail é obrigatório.' })
      .min(1, { message: 'E-mail é obrigatório.' })
      .email({ message: 'E-mail deve ser válido.' }),
    telephone: z
      .string({ message: 'Telefone é obrigatório.' })
      .min(14, { message: 'Telefone inválido.' }),
    street: z
      .string({ message: 'Rua é obrigatória.' })
      .min(1, { message: 'Rua é obrigatória.' }),
    number: z
      .string({ message: 'Número é obrigatório.' })
      .min(1, { message: 'Número é obrigatório.' }),
    neighborhood: z
      .string({ message: 'Bairro é obrigatório.' })
      .min(1, { message: 'Bairro é obrigatório.' }),
    cep: z
      .string({ message: 'CEP é obrigatório.' })
      .min(9, { message: 'CEP inválido.' }),
    city: z
      .string({ message: 'Cidade é obrigatória.' })
      .min(1, { message: 'Cidade é obrigatória.' }),
    state: z
      .string({ message: 'Estado é obrigatório.' })
      .min(1, { message: 'Estado é obrigatório.' }),
  }),
)
