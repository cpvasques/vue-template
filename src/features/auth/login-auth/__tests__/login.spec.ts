import { mount } from '@vue/test-utils'
import { useForm } from 'vee-validate'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'vue-sonner'

import { useLogin } from '@/features/auth/login-auth/model/useLogin'

import LoginForm from '../index.vue'

// Mock de vee-validate
vi.mock('vee-validate', () => ({
  useForm: vi.fn().mockReturnValue({
    handleSubmit: vi.fn((fn) => fn),
    validate: vi.fn().mockResolvedValue({ valid: true }),
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
  Button: {
    template: '<button><slot /></button>',
  },
}))

vi.mock('@/shared/components/form', () => ({
  FormControl: {
    template: '<div><slot /></div>',
  },
  FormField: {
    template:
      '<div><slot v-bind="{ componentField: {}, errors: [] }" /></div>',
  },
  FormItem: {
    template: '<div><slot /></div>',
  },
  FormLabel: {
    template: '<label><slot /></label>',
  },
  FormMessage: {
    template: '<div><slot /></div>',
  },
}))

vi.mock('@/shared/components/input', () => ({
  Input: {
    template: '<input />',
  },
}))

vi.mock('@/shared/components/input-password', () => ({
  InputPassword: {
    template: '<input type="password" />',
  },
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

// Mock de useLogin
vi.mock('@/features/auth/login-auth/model/useLogin', () => ({
  useLogin: vi.fn().mockReturnValue({
    postLogin: vi.fn().mockReturnValue({
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
vi.mock('@/features/auth/composables/schemas/loginSchema', () => {
  return {
    loginSchema: {},
  }
})

describe('LoginForm', () => {
  // Reset dos mocks antes de cada teste
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar corretamente', () => {
    const wrapper = mount(LoginForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Login')
    expect(wrapper.text()).toContain('Digite seu e-mail e senha para entrar')
    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('Senha')
    expect(wrapper.text()).toContain('Esqueci minha senha')
    expect(wrapper.text()).toContain('Entrar')
    expect(wrapper.text()).toContain('Ainda não é cadastrado?')
    expect(wrapper.text()).toContain('Cadastre-se')
  })

  it('deve ter um link para recuperação de senha', () => {
    const wrapper = mount(LoginForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    const recoverLink = wrapper.find('a[href="/auth/recover-password"]')
    expect(recoverLink.exists()).toBe(true)
    expect(recoverLink.text()).toBe('Esqueci minha senha')
  })

  it('deve ter links para termos de serviço e política de privacidade', () => {
    const wrapper = mount(LoginForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    const links = wrapper.findAll('.text-zinc-500 a')
    expect(links.length).toBe(2)
    expect(links[0].text()).toBe('Termos de Serviço')
    expect(links[1].text()).toBe('Política de Privacidade')
  })

  it('deve chamar o método submit ao clicar no botão de entrar', async () => {
    // Mocks
    const validateMock = vi.fn().mockResolvedValue({ valid: true })
    const postLoginMutateMock = vi.fn()

    // Configurar mocks para este teste
    const useFormMock = vi.fn().mockReturnValue({
      handleSubmit: (fn: (values: any) => Promise<void>) => async () => fn({}),
      validate: validateMock,
    })

    const postLoginMock = vi.fn().mockReturnValue({
      mutate: postLoginMutateMock,
      isPending: false,
    })

    const useLoginMock = vi.fn().mockReturnValue({
      postLogin: postLoginMock,
    })

    // Substituir implementações dos mocks
    vi.mocked(useForm).mockImplementation(useFormMock)
    vi.mocked(useLogin).mockImplementation(useLoginMock)

    const wrapper = mount(LoginForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    const form = wrapper.find('form')

    await form.trigger('submit')

    // Verificar se o validate foi chamado
    expect(validateMock).toHaveBeenCalled()
  })

  it('deve mostrar erro ao inserir um email inválido', async () => {
    const validateMock = vi.fn().mockResolvedValue({
      valid: false,
      errors: { email: ['E-mail deve ser válido.'] },
    })

    const useFormMock = vi.fn().mockReturnValue({
      handleSubmit: (fn: (values: any) => Promise<void>) => async () =>
        fn({ email: 'emailinvalido', password: '123' }),
      validate: validateMock,
    })

    vi.mocked(useForm).mockImplementation(useFormMock)

    const wrapper = mount(LoginForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const emailWrapper = wrapper.find('[name="email"]').find('input')
    await emailWrapper.setValue('emailinvalido')

    await wrapper.find('form').trigger('submit')

    expect(validateMock).toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith('Preencha os campos corretamente')
  })

  it('deve mostrar mensagem de erro quando a validação falhar', async () => {
    // Configurar mocks para validação com falha
    const validateMock = vi.fn().mockResolvedValue({ valid: false })

    const useFormMock = vi.fn().mockReturnValue({
      handleSubmit: (fn: (values: any) => Promise<void>) => async () => fn({}),
      validate: validateMock,
    })

    // Substituir implementação
    vi.mocked(useForm).mockImplementation(useFormMock)

    const wrapper = mount(LoginForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    await wrapper.find('form').trigger('submit')

    // Verificar se o toast.error foi chamado
    expect(toast.error).toHaveBeenCalledWith('Preencha os campos corretamente')
  })

  it('deve redirecionar para a página de recuperação de senha ao clicar em "Esqueci minha senha"', () => {
    const wrapper = mount(LoginForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const recoverLink = wrapper.find('a[href="/auth/recover-password"]')
    expect(recoverLink.exists()).toBe(true)
    expect(recoverLink.attributes('href')).toBe('/auth/recover-password')
    expect(recoverLink.text()).toBe('Esqueci minha senha')
  })

  it('deve ter um botão de cadastro com o texto "Cadastre-se" e deve estar presente', () => {
    const wrapper = mount(LoginForm, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const registerButton = wrapper.find('[name="register-button"]')
    expect(registerButton.exists()).toBe(true)
    expect(registerButton.text()).toBe('Cadastre-se')
  })
})
