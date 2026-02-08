import { test, expect } from '@playwright/test'

test('Valida fluxo de login com o e-mail em branco', async ({ page }) => {
  await page.goto('http://localhost:8080/auth/login')
  await page.getByRole('textbox', { name: 'Senha' }).click()
  await page.getByRole('textbox', { name: 'Senha' }).fill('123')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.locator('#reka-v-0-form-item-message')).toContainText(
    'E-mail é obrigatório.',
  )
})
