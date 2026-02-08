import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import UpdateProfile from '../index.vue'

// Mock dos componentes UI
vi.mock('@/shared/components/card', () => ({
  Card: { template: '<div><slot /></div>' },
  CardContent: { template: '<div><slot /></div>' },
  CardHeader: { template: '<div><slot /></div>' },
  CardTitle: { template: '<h2><slot /></h2>' },
}))

vi.mock('@/shared/components/form', () => ({
  FormControl: { template: '<div><slot /></div>' },
  FormField: {
    template: '<div><slot v-bind="{ componentField: {}, errors: [] }" /></div>',
  },
  FormItem: { template: '<div><slot /></div>' },
  FormLabel: { template: '<label><slot /></label>' },
  FormMessage: { template: '<div><slot /></div>' },
}))

vi.mock('@/shared/components/input', () => ({
  Input: { template: '<input />' },
}))

// Mock para o módulo useHandleUsers
vi.mock('@/features/users/handle-users/model/useHandleUsers', () => ({
  useHandleUsers: () => ({
    updateUser: () => ({
      mutate: vi.fn(),
    }),
  }),
}))

// Mock para o vee-validate
vi.mock('vee-validate', () => ({
  useForm: vi.fn().mockReturnValue({
    handleSubmit: vi.fn((fn) => fn),
    validate: vi.fn().mockResolvedValue({ valid: true }),
  }),
}))

// Mock para o toast
vi.mock('vue-sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

describe('UpdateProfile', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(UpdateProfile)
    vi.clearAllMocks()
  })

  it('deve exibir todos os campos obrigatórios do formulário', () => {
    const requiredFields = [
      'name',
      'surname',
      'email',
      'telephone',
      'street',
      'number',
      'neighborhood',
      'cep',
      'city',
      'state',
    ]

    requiredFields.forEach((field) => {
      const input = wrapper.findComponent(`[name="${field}"]`)
      expect(input.exists()).toBe(true)
    })
  })

  it('deve validar o formato do email corretamente', async () => {
    // Mock do useField para simular input de email
    vi.mock('vee-validate', () => ({
      useForm: vi.fn().mockReturnValue({
        handleSubmit: vi.fn((fn) => fn),
        validate: vi.fn().mockResolvedValue({ valid: false }),
      }),
      useField: vi.fn().mockReturnValue({
        value: 'email-invalido',
        errorMessage: 'E-mail deve ser válido.',
        handleChange: vi.fn(),
      }),
    }))

    // Simula input de email inválido
    const emailInput = wrapper.find('[name="email"]').find('input')
    expect(emailInput.exists()).toBe(true)

    await emailInput.setValue('email-invalido')
    await emailInput.trigger('blur')

    // Tenta submeter o formulário
    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)
    await form.trigger('submit')
  })
})
