import { test, expect } from '@playwright/test'

test('Valida fluxo de recuperar senha com input em branco', async ({
  page,
}) => {
  await page.goto('http://localhost:8080/auth/recover-password')
  await page.getByRole('button', { name: 'Recuperar senha' }).click()
  await expect(page.locator('#reka-v-0-form-item-message')).toContainText(
    'E-mail é obrigatório.',
  )
})
