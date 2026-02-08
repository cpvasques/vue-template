import { test, expect } from '@playwright/test'

test('Valida fluxo novo usuário', async ({ page }) => {
  await page.goto('http://localhost:8080/users')
  await page.getByRole('button', { name: 'Novo usuário' }).click()
  await page.getByRole('dialog', { name: 'Novo usuário' }).click()
  await expect(page.getByLabel('Novo usuário')).toMatchAriaSnapshot(`
    - dialog "Novo usuário":
      - heading "Novo usuário" [level=2]:
        - button:
          - img
      - paragraph: Preencha as informações abaixo para criar um novo usuário
      - text: Nome do usuário
      - textbox "Digite o nome do usuário"
      - textbox "Digite o email do usuário"
      - textbox "Digite o telefone do usuário"
      - combobox: Selecionar
      - button "Cancelar"
      - button "Salvar"
    `)
})
