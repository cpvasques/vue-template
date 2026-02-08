import { test, expect } from '@playwright/test'

test('Valida fluxo editar usuário', async ({ page }) => {
  await page.goto('http://localhost:8080/users')
  await page
    .getByRole('row', { name: 'João Silva joao@example.com (' })
    .getByRole('button')
    .first()
    .click()
  await expect(page.getByLabel('Editar usuário')).toMatchAriaSnapshot(`
    - dialog "Editar usuário":
      - heading "Editar usuário" [level=2]:
        - button:
          - img
      - paragraph: Atualize as informações do usuário e salve as alterações.
      - text: Nome do usuário
      - textbox "Digite o nome do usuário"
      - textbox "Digite o email do usuário"
      - textbox "Digite o telefone do usuário"
      - combobox: Ativo
      - button "Cancelar"
      - button "Salvar"
    `)
})
