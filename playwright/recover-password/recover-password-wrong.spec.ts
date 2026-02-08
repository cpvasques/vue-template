import { test, expect } from '@playwright/test'

test('Valida fluxo de recuperar senha digitando um e-mail inválido', async ({
  page,
}) => {
  await page.goto('http://localhost:8080/auth/recover-password')
  await page.getByRole('textbox', { name: 'm@example.com' }).click()
  await page.getByRole('textbox', { name: 'm@example.com' }).fill('123456')
  await expect(page.locator('#reka-v-0-form-item-message')).toContainText(
    'E-mail deve ser válido.',
  )
})
