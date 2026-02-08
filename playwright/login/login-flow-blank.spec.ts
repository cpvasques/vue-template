import { test, expect } from '@playwright/test'

test('Valida fluxo do login com campos em branco', async ({ page }) => {
  await page.goto('http://localhost:8080/auth/login')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.locator('#reka-v-0-form-item-message')).toContainText(
    'E-mail é obrigatório.',
  )
})
