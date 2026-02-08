import { test, expect } from '@playwright/test'

test('Valida o flow de login com um e-mail errado', async ({ page }) => {
  await page.goto('http://localhost:8080/auth/login')
  await page.getByRole('textbox', { name: 'm@example.com' }).click()
  await page.getByRole('textbox', { name: 'm@example.com' }).fill('123456')
  await expect(page.locator('#reka-v-0-form-item-message')).toContainText(
    'E-mail deve ser válido.',
  )
})
