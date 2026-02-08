import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PasswordRules from '../ui/password-rules.vue'

describe('PasswordRules', () => {
  it('deve mostrar indicações visuais baseadas nas regras de senha', async () => {
    // Montar o componente com uma senha que atende a algumas regras
    const wrapper = mount(PasswordRules, {
      props: {
        password: 'Test@12',
      },
    })

    // Verificar as classes de texto para cada regra
    const rules = wrapper.findAll('.flex.items-center span')

    // Validar regras específicas
    // Test@12 deve falhar apenas na regra de comprimento mínimo
    expect(rules[0].classes()).toContain('text-red-600') // minLength (falha)
    expect(rules[1].classes()).toContain('text-emerald-500') // uppercase (ok)
    expect(rules[2].classes()).toContain('text-emerald-500') // lowercase (ok)
    expect(rules[3].classes()).toContain('text-emerald-500') // numbers (ok)
    expect(rules[4].classes()).toContain('text-emerald-500') // specialChars (ok)

    // Atualizar props para uma senha que falha em outro critério
    await wrapper.setProps({ password: 'test@1234' })

    // Agora deve falhar na regra de letras maiúsculas
    expect(rules[0].classes()).toContain('text-emerald-500') // minLength (ok)
    expect(rules[1].classes()).toContain('text-red-600') // uppercase (falha)
    expect(rules[2].classes()).toContain('text-emerald-500') // lowercase (ok)
    expect(rules[3].classes()).toContain('text-emerald-500') // numbers (ok)
    expect(rules[4].classes()).toContain('text-emerald-500') // specialChars (ok)

    // Testar senha que atende a todos os critérios
    await wrapper.setProps({ password: 'Test@1234' })

    // Todas as regras devem passar
    expect(rules[0].classes()).toContain('text-emerald-500') // minLength (ok)
    expect(rules[1].classes()).toContain('text-emerald-500') // uppercase (ok)
    expect(rules[2].classes()).toContain('text-emerald-500') // lowercase (ok)
    expect(rules[3].classes()).toContain('text-emerald-500') // numbers (ok)
    expect(rules[4].classes()).toContain('text-emerald-500') // specialChars (ok)
  })
})
