import { mount } from '@vue/test-utils'
import { useForm } from 'vee-validate'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'vue-sonner'

import { useNewPassword } from '@/features/auth/new-password-auth/model/useNewPassword'

import NewPassword from '../index.vue'
import PasswordRules from '../ui/password-rules.vue'

vi.mock('vee-validate', () => ({
  useForm: vi.fn().mockReturnValue({
    handleSubmit: vi.fn((fn) => fn),
    validate: vi.fn().mockResolvedValue({ valid: true }),
  }),
  useField: vi.fn().mockReturnValue({
    value: '',
    errorMessage: '',
    handleChange: vi.fn(),
  }),
}))

// Mock o RouterLink
const RouterLinkStub = {
  name: 'RouterLink',
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
}

// Mock dos componentes UI
vi.mock('@/shared/components/button', () => ({
  Button: { template: '<button><slot /></button>' },
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

vi.mock('@/shared/components/input-password', () => ({
  InputPassword: { template: '<input type="password" />' },
}))

// Mock do vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
    })),
  }
})

// Mock de useNewPassword
vi.mock('@/features/auth/new-password-auth/model/useNewPassword', () => ({
  useNewPassword: vi.fn().mockReturnValue({
    postNewPassword: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    }),
  }),
}))

// Mock do toast
vi.mock('vue-sonner', () => {
  return {
    toast: {
      error: vi.fn(),
    },
  }
})

// Mock do loginSchema
vi.mock('@/features/auth/composables/schemas/newPasswordSchema', () => {
  return {
    newPasswordSchema: {},
  }
})

describe('NewPassword', () => {
  // Reset dos mocks antes de cada teste
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar corretamente', () => {
    const wrapper = mount(NewPassword, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Nova senha')
    expect(wrapper.text()).toContain(
      'Crie uma nova senha para acessar sua conta.',
    )
    expect(wrapper.text()).toContain('Nova senha')
    expect(wrapper.text()).toContain('Confirmar nova senha')
    expect(wrapper.text()).toContain('No mínimo 8 caracteres')
    expect(wrapper.text()).toContain('Letra maiúscula (A-Z)')
    expect(wrapper.text()).toContain('Letra minúscula (a-z)')
    expect(wrapper.text()).toContain('Números (0-9)')
    expect(wrapper.text()).toContain('Caracteres especiais (@#&*)')
  })

  it('deve chamar o método submit ao clicar no botão de Redefinir senha', async () => {
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const postNewPasswordMutateMock = vi.fn()

    const useFormMock = vi.fn().mockReturnValue({
      handleSubmit: (fn: (values: any) => Promise<void>) => async () => fn({}),
      validate: validateMock,
    })

    const postNewPasswordMock = vi.fn().mockReturnValue({
      mutate: postNewPasswordMutateMock,
      isPending: false,
    })

    const useNewPasswordMock = vi.fn().mockReturnValue({
      postNewPassword: postNewPasswordMock,
    })

    vi.mocked(useForm).mockImplementation(useFormMock)
    vi.mocked(useNewPassword).mockImplementation(useNewPasswordMock)

    const wrapper = mount(NewPassword, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    const form = wrapper.find('form')

    await form.trigger('submit')

    expect(validateMock).toHaveBeenCalled()
  })

  it('deve mostrar mensagem de erro quando a validação falhar', async () => {
    const validateMock = vi.fn().mockResolvedValue({ valid: false })
    const useFormMock = vi.fn().mockReturnValue({
      handleSubmit: (fn: (values: any) => Promise<void>) => async () => fn({}),
      validate: validateMock,
    })

    vi.mocked(useForm).mockImplementation(useFormMock)

    const wrapper = mount(NewPassword, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    await wrapper.find('form').trigger('submit')

    expect(toast.error).toHaveBeenCalledWith('Preencha os campos corretamente')
  })

  it('deve mostrar feedback visual das regras de senha', async () => {
    // Mock do useField para retornar valores de teste
    vi.mock('vee-validate', () => ({
      useForm: vi.fn().mockReturnValue({
        handleSubmit: vi.fn((fn) => fn),
        validate: vi.fn().mockResolvedValue({ valid: true }),
      }),
      useField: vi.fn().mockReturnValue({
        value: 'Test@12',
        errorMessage: '',
        handleChange: vi.fn(),
      }),
    }))

    // Montar o componente
    const wrapper = mount(NewPassword, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    // Verificar que o componente PasswordRules existe
    const passwordRules = wrapper.findComponent(PasswordRules)
    expect(passwordRules.exists()).toBe(true)
  })

  it('deve validar campos de senha e confirmação de senha', async () => {
    // Preparar mock para verificar a chamada de mutação
    const postNewPasswordMutateMock = vi.fn()
    const postNewPasswordMock = vi.fn().mockReturnValue({
      mutate: postNewPasswordMutateMock,
      isPending: false,
    })

    // Mock do useNewPassword com todos os métodos necessários
    vi.mocked(useNewPassword).mockReturnValue({
      postNewPassword: postNewPasswordMock,
    })

    // Mock inicial para validação falhar
    const validateMock = vi.fn().mockResolvedValue({ valid: false })
    const useFormMock = vi.fn().mockReturnValue({
      handleSubmit: (fn: (values: any) => Promise<void>) => async () => fn({}),
      validate: validateMock,
    })

    // Reset do mock toast antes de cada chamada
    vi.mocked(toast.error).mockClear()
    vi.mocked(useForm).mockImplementation(useFormMock)

    const wrapper = mount(NewPassword, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    // Testar quando validação falha
    await wrapper.find('form').trigger('submit')
    expect(toast.error).toHaveBeenCalledWith('Preencha os campos corretamente')
    expect(postNewPasswordMutateMock).not.toHaveBeenCalled()

    // Mock de useForm para simulação de sucesso
    const useFormSuccessMock = vi.fn().mockReturnValue({
      handleSubmit: (fn: (values: any) => Promise<void>) => async () => {
        await fn({ password: 'Test@1234', confirmPassword: 'Test@1234' })
      },
      validate: vi.fn().mockResolvedValue({ valid: true }),
    })

    vi.mocked(toast.error).mockClear()
    vi.mocked(useForm).mockImplementation(useFormSuccessMock)
    vi.mocked(postNewPasswordMutateMock).mockClear()

    const wrapper2 = mount(NewPassword, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    // Testar quando validação passa
    await wrapper2.find('form').trigger('submit')
    expect(toast.error).not.toHaveBeenCalled()
    expect(postNewPasswordMutateMock).toHaveBeenCalled()
    // Verificar que foi chamado com os dados corretos
    expect(postNewPasswordMutateMock).toHaveBeenCalledWith(
      { password: 'Test@1234', token: 'token' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )
  })

  it('deve mostrar loading state durante o envio do formulário', async () => {
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const useFormMock = vi.fn().mockReturnValue({
      handleSubmit: (fn: (values: any) => Promise<void>) => async () => fn({}),
      validate: validateMock,
    })

    const postNewPasswordMock = vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    })

    vi.mocked(useForm).mockImplementation(useFormMock)
    vi.mocked(useNewPassword).mockImplementation(() => ({
      postNewPassword: postNewPasswordMock,
    }))

    const wrapper = mount(NewPassword, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('is-loading')).toBe('true')
  })

  it('deve mostrar componente de regras de senha', async () => {
    const wrapper = mount(NewPassword, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    // Verificar se o componente PasswordRules existe
    const passwordRules = wrapper.findComponent(PasswordRules)
    expect(passwordRules.exists()).toBe(true)
  })
})
