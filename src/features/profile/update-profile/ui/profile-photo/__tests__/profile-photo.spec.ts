import { Avatar, AvatarImage } from '@/shared/components/avatar'
import { Button } from '@/shared/components/button'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from '@/shared/components/dialog'
import { mount } from '@vue/test-utils'
import { X } from 'lucide-vue-next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'vue-sonner'

import ProfilePhoto from '../index.vue'

// Mock para o módulo useHandlePhoto
const mockMutate = vi.fn()
vi.mock('../../../model/useHandlePhoto', () => ({
  useChangePhoto: () => ({
    postNewPhoto: () => ({
      mutate: mockMutate,
      isPending: false,
    }),
  }),
}))

// Mock de vee-validate
vi.mock('vee-validate', () => ({
  useForm: vi.fn().mockReturnValue({
    handleSubmit: vi.fn((fn) => fn),
    validate: vi.fn().mockResolvedValue({ valid: true }),
  }),
}))

// Mock para o toast
vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock dos componentes UI
vi.mock('@/shared/components/avatar', () => ({
  Avatar: {
    template: '<div><slot /></div>',
  },
  AvatarImage: {
    template: '<img />',
  },
}))

vi.mock('@/shared/components/button', () => ({
  Button: {
    template: '<button><slot /></button>',
  },
}))

vi.mock('@/shared/components/dialog', () => ({
  Dialog: {
    template: '<div><slot /></div>',
  },
  DialogClose: {
    template: '<button><slot /></button>',
  },
  DialogContent: {
    template: '<div><slot /></div>',
  },
  DialogDescription: {
    template: '<p><slot /></p>',
  },
  DialogFooter: {
    template: '<footer><slot /></footer>',
  },
  DialogHeader: {
    template: '<header><slot /></header>',
  },
  DialogTitle: {
    template: '<h2><slot /></h2>',
  },
}))

describe('ProfilePhoto', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(ProfilePhoto, {
      global: {
        stubs: {
          teleport: true,
        },
      },
    })
  })

  it('deve renderizar corretamente', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Trocar foto')
  })

  it('deve fechar o dialog ao chamar handleCloseDialog', async () => {
    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleOpenDialog()
    // @ts-expect-error - Acessando propriedade interna do componente
    expect(wrapper.vm.isDialogOpen).toBe(true)

    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleCloseDialog()
    // @ts-expect-error - Acessando propriedade interna do componente
    expect(wrapper.vm.isDialogOpen).toBe(false)
  })

  it('deve limpar os dados da imagem ao fechar o dialog', async () => {
    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleOpenDialog()

    // Simular a seleção de uma imagem
    // @ts-expect-error - Acessando propriedade interna do componente
    wrapper.vm.imageData = {
      previewUrl: 'test-url',
      selectedFile: new File([''], 'test.jpg', { type: 'image/jpeg' }),
    }

    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleCloseDialog()
    // @ts-expect-error - Acessando propriedade interna do componente
    expect(wrapper.vm.imageData.previewUrl).toBeNull()
    // @ts-expect-error - Acessando propriedade interna do componente
    expect(wrapper.vm.imageData.selectedFile).toBeNull()
  })

  it('deve ter três botões no DialogFooter', async () => {
    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleOpenDialog()
    const dialogContent = wrapper.findComponent(DialogContent)
    const dialogFooter = dialogContent.findComponent(DialogFooter)
    const buttons = dialogFooter.findAllComponents(Button)

    expect(buttons.length).toBe(3)
    expect(buttons[0].text()).toBe('Cancelar')
    expect(buttons[1].text()).toBe('Apagar foto')
    expect(buttons[2].text()).toBe('Trocar foto')
  })

  it('deve desabilitar o botão de apagar foto quando não há imagem selecionada', async () => {
    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleOpenDialog()
    const dialogContent = wrapper.findComponent(DialogContent)
    const dialogFooter = dialogContent.findComponent(DialogFooter)
    const buttons = dialogFooter.findAllComponents(Button)

    expect(buttons[1].attributes('disabled')).toBeDefined()
  })

  it('deve habilitar o botão de apagar foto quando há imagem selecionada', async () => {
    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleOpenDialog()

    // Simular a seleção de uma imagem
    // @ts-expect-error - Acessando propriedade interna do componente
    wrapper.vm.imageData = {
      previewUrl: 'test-url',
      selectedFile: new File([''], 'test.jpg', { type: 'image/jpeg' }),
    }

    await wrapper.vm.$nextTick()

    const dialogContent = wrapper.findComponent(DialogContent)
    const dialogFooter = dialogContent.findComponent(DialogFooter)
    const buttons = dialogFooter.findAllComponents(Button)

    expect(buttons[1].attributes('disabled')).toBeUndefined()
  })

  it('deve mostrar um ícone de X para fechar o dialog', async () => {
    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleOpenDialog()
    const dialogClose = wrapper.findComponent(DialogClose)

    expect(dialogClose.exists()).toBe(true)
    expect(dialogClose.findComponent(X).exists()).toBe(true)
  })

  it('deve mostrar a imagem de perfil', async () => {
    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleOpenDialog()
    const avatar = wrapper.findComponent(Avatar)
    const avatarImage = avatar.findComponent(AvatarImage)

    expect(avatarImage.exists()).toBe(true)
    expect(avatarImage.attributes('src')).toBe('https://placehold.co/216x216')
  })

  it('deve chamar toast.success ao remover uma foto', async () => {
    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleOpenDialog()

    // Simular a seleção de uma imagem
    // @ts-expect-error - Acessando propriedade interna do componente
    wrapper.vm.imageData = {
      previewUrl: 'test-url',
      selectedFile: new File([''], 'test.jpg', { type: 'image/jpeg' }),
    }

    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleRemovePhoto()

    expect(toast.success).toHaveBeenCalledWith('Foto removida')
  })

  it('deve ter um input de arquivo oculto', async () => {
    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleOpenDialog()
    const fileInput = wrapper.find('input[type="file"]')

    expect(fileInput.exists()).toBe(true)
    expect(fileInput.attributes('accept')).toBe('image/*')
    expect(fileInput.classes()).toContain('hidden')
  })

  it('deve chamar postNewPhotoMutate ao clicar em Trocar foto', async () => {
    // @ts-expect-error - Acessando método interno do componente
    await wrapper.vm.handleOpenDialog()

    // Simular a seleção de uma imagem
    // @ts-expect-error - Acessando propriedade interna do componente
    wrapper.vm.imageData = {
      previewUrl: 'test-url',
      selectedFile: new File([''], 'test.jpg', { type: 'image/jpeg' }),
    }

    const dialogContent = wrapper.findComponent(DialogContent)
    const dialogFooter = dialogContent.findComponent(DialogFooter)
    const buttons = dialogFooter.findAllComponents(Button)

    await buttons[2].trigger('click')
    expect(mockMutate).toHaveBeenCalledWith({
      // @ts-expect-error - Acessando propriedade interna do componente
      file: wrapper.vm.imageData.selectedFile,
    })
  })
})
