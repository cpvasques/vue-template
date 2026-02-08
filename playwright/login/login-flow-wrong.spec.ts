import { test, expect } from '@playwright/test'

test('Valida o flow de login com um e-mail errado e a senha em branco', async ({
  page,
}) => {
  await page.goto('http://localhost:8080/auth/login')
  await page.getByRole('textbox', { name: 'm@example.com' }).click()
  await page.getByRole('textbox', { name: 'm@example.com' }).fill('123456')
  await expect(page.locator('#reka-v-0-form-item-message')).toContainText(
    'E-mail deve ser válido.',
  )
  await page.getByRole('textbox', { name: 'Senha' }).click()
  await page.getByRole('textbox', { name: 'Senha' }).fill('')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.locator('#reka-v-1-form-item-message')).toContainText(
    'Senha é obrigatória.',
  )
})
