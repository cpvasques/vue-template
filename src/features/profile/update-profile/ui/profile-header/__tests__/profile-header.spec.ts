import { Button } from '@/shared/components/button'
import { mount } from '@vue/test-utils'
import { ChevronLeft } from 'lucide-vue-next'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ProfileHeader from '../index.vue'

// Mock do router
const mockBack = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}))

// Mock dos componentes UI
vi.mock('@/shared/components/button', () => ({
  Button: {
    template: '<button><slot /></button>',
  },
}))

describe('ProfileHeader', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(ProfileHeader, {
      props: {
        name: 'Laura Vigário',
      },
    })
  })

  it('deve renderizar corretamente', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('deve mostrar o nome do usuário', () => {
    expect(wrapper.text()).toContain('Laura Vigário')
  })

  it('deve ter um botão de voltar', () => {
    const backButton = wrapper.findComponent(ChevronLeft)
    expect(backButton.exists()).toBe(true)
  })

  it('deve ter um botão de editar perfil', () => {
    const buttons = wrapper.findAllComponents(Button)
    const editButton = buttons.find((b) => b.text().includes('Editar perfil'))
    expect(editButton?.exists()).toBe(true)
    expect(editButton?.text()).toBe('Editar perfil')
  })

  it('deve emitir submitForm quando o botão de editar for clicado', async () => {
    const buttons = wrapper.findAllComponents(Button)
    const editButton = buttons.find((b) => b.text().includes('Editar perfil'))
    await editButton?.trigger('click')
    expect(wrapper.emitted('submitForm')).toBeTruthy()
  })

  it('deve manter a estrutura visual correta', () => {
    // Verificar container principal
    expect(wrapper.find('.flex.w-full.flex-col').exists()).toBe(true)

    // Verificar botão de voltar (ícone ChevronLeft)
    expect(wrapper.findComponent(ChevronLeft).exists()).toBe(true)

    // Verificar título com nome
    expect(wrapper.text()).toContain('Laura Vigário')

    // Verificar botão de editar
    expect(wrapper.text()).toContain('Editar perfil')
  })
})
