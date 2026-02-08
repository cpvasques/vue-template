import { expect, test } from '@playwright/test'

test('Valida fluxo de login', async ({ page }) => {
  await page.goto('/auth/login')
  await page.getByRole('textbox', { name: 'm@example.com' }).click()
  await page
    .getByRole('textbox', { name: 'm@example.com' })
    .fill('dev@teste.com')
  await page.getByRole('textbox', { name: 'Senha' }).click()
  await page.getByRole('textbox', { name: 'Senha' }).fill('123456')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.route('http://localhost:8080/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Mocked response' }),
    })
  })
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveURL('/auth/two-factor-auth')
  await page.getByRole('textbox', { name: 'pin input 1 of' }).click()
  await page.getByRole('textbox', { name: 'pin input 1 of' }).fill('1')
  await page.getByRole('textbox', { name: 'pin input 2 of' }).fill('2')
  await page.getByRole('textbox', { name: 'pin input 3 of' }).fill('3')
  await page.getByRole('textbox', { name: 'pin input 4 of' }).fill('4')
  await page.getByRole('textbox', { name: 'pin input 5 of' }).fill('5')
  await page.getByRole('textbox', { name: 'pin input 6 of' }).fill('6')
  await page.getByRole('button', { name: 'Verificar' }).click()
  await page.route('http://localhost:8080/auth/2fa', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Mocked response' }),
    })
  })
})
