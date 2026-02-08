import { mount } from '@vue/test-utils'
import { useForm } from 'vee-validate'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'vue-sonner'

import { useRecoverPassword } from '@/features/auth/recover-password-auth/model/useRecoverPassword'

import RecoveryForm from '../index.vue'

vi.mock('vee-validate', () => ({
  useForm: vi.fn().mockReturnValue({
    handleSubmit: vi.fn((fn) => fn),
    validate: vi.fn().mockResolvedValue({ valid: true }),
  }),
}))

const RouterLinkStub = {
  name: 'RouterLink',
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
}

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

vi.mock('@/shared/components/input', () => ({
  Input: { template: '<input />' },
}))

vi.mock('@/shared/components/input-password', () => ({
  InputPassword: { template: '<input type="password" />' },
}))

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
    })),
  }
})

vi.mock(
  '@/features/auth/recover-password-auth/model/useRecoverPassword',
  () => ({
    useRecoverPassword: vi.fn().mockReturnValue({
      postRecoverPassword: vi.fn().mockReturnValue({
        mutate: vi.fn(),
        isPending: false,
      }),
    }),
  }),
)

vi.mock('vue-sonner', () => {
  return {
    toast: {
      error: vi.fn(),
    },
  }
})

vi.mock('@/features/auth/composables/schemas/recoverSchema', () => {
  return {
    recoverPasswordSchema: {},
  }
})

describe('RecoveryForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar corretamente', () => {
    const wrapper = mount(RecoveryForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Recuperar senha')
    expect(wrapper.text()).toContain(
      'Informe o e-mail cadastrado para receber o código de verificação.',
    )
    expect(wrapper.text()).toContain('Email')
  })

  it('deve chamar o método submit ao clicar no botão de Recuperar senha', async () => {
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const postRecoverMutateMock = vi.fn()

    const useFormMock = vi.fn().mockReturnValue({
      handleSubmit: (fn: (values: any) => Promise<void>) => async () => fn({}),
      validate: validateMock,
    })

    const postRecoverMock = vi.fn().mockReturnValue({
      mutate: postRecoverMutateMock,
      isPending: false,
    })

    const useRecoverPasswordMock = vi.fn().mockReturnValue({
      postRecoverPassword: postRecoverMock,
    })

    vi.mocked(useForm).mockImplementation(useFormMock)
    vi.mocked(useRecoverPassword).mockImplementation(useRecoverPasswordMock)

    const wrapper = mount(RecoveryForm, {
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

    const wrapper = mount(RecoveryForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    await wrapper.find('form').trigger('submit')

    expect(toast.error).toHaveBeenCalledWith('Preencha os campos corretamente')
  })

  it('deve ter um botão de recuperação de senha com o texto "Recuperar senha" e deve estar presente', () => {
    const wrapper = mount(RecoveryForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const recoverButton = wrapper.find('button[type="submit"]')
    expect(recoverButton.exists()).toBe(true)
    expect(recoverButton.text()).toBe('Recuperar senha')
  })
})
