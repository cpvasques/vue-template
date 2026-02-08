import { test, expect } from '@playwright/test'

test('Valida fluxo de recuperar senha', async ({ page }) => {
  await page.goto('http://localhost:8080/auth/recover-password')
  await page.getByRole('textbox', { name: 'm@example.com' }).click()
  await page
    .getByRole('textbox', { name: 'm@example.com' })
    .fill('livrodjx@gmail.com')
  await page.getByRole('button', { name: 'Recuperar senha' }).click()
  await page.route('http://localhost:8080/auth/recover', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Mocked response' }),
    })
  })
})
