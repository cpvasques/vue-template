import { test, expect } from '@playwright/test'

test('Valida fluxo excluir usuário', async ({ page }) => {
  await page.goto('http://localhost:8080/users')
  await page
    .getByRole('row', { name: 'Pedro Oliveira pedro@example.' })
    .getByRole('button')
    .nth(1)
    .click()
  await expect(page.getByLabel('Excluir usuário')).toMatchAriaSnapshot(`
    - dialog "Excluir usuário":
      - heading "Excluir usuário" [level=2]:
        - button:
          - img
      - paragraph: Tem certeza que deseja excluir o usuário Pedro Oliveira?
      - button "Cancelar"
      - button "Excluir"
    `)
})
