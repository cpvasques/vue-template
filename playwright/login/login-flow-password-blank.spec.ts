import { test, expect } from '@playwright/test'

test('Valida fluxo de login com a senha em branco', async ({ page }) => {
  await page.goto('http://localhost:8080/auth/login')
  await page.getByRole('textbox', { name: 'm@example.com' }).click()
  await page
    .getByRole('textbox', { name: 'm@example.com' })
    .fill('livrodjx@gmail.com')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.locator('.absolute').first().click()
  await expect(page.locator('#reka-v-1-form-item-message')).toContainText(
    'Senha é obrigatória.',
  )
})
