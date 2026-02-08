import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ProfileInfo from '../index.vue'

const defaultProps = {
  name: 'Laura Vigário',
  email: 'laura@email.com',
  avatar: 'https://placehold.co/100x100',
}

describe('ProfileInfo', () => {
  it('deve renderizar corretamente', () => {
    const wrapper = mount(ProfileInfo, {
      props: defaultProps,
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('deve mostrar as informações de perfil corretas', () => {
    const wrapper = mount(ProfileInfo, {
      props: defaultProps,
    })

    expect(wrapper.text()).toContain('Laura Vigário')
    expect(wrapper.text()).toContain('laura@email.com')
  })

  it('deve emitir evento change-photo ao clicar no botão de editar foto', async () => {
    const wrapper = mount(ProfileInfo, {
      props: defaultProps,
    })

    const photoEditButton = wrapper.find('button[aria-label="Alterar foto"]')
    await photoEditButton.trigger('click')

    const emitted = wrapper.emitted('change-photo')
    expect(emitted).toBeTruthy()
    expect(emitted?.length).toBe(1)
  })

  it('deve mostrar a imagem de perfil do usuário', () => {
    const wrapper = mount(ProfileInfo, {
      props: defaultProps,
    })

    const profileImage = wrapper.find('img')
    expect(profileImage.exists()).toBe(true)
    expect(profileImage.attributes('src')).toBe('https://placehold.co/100x100')
  })
})
