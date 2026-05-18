import { test, expect } from '@playwright/test'

test.describe('Auth Pages', () => {
  test('login page renders with email/password form and social buttons', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('Welcome back').first()).toBeVisible()
    await expect(page.getByText('Continue with Google').first()).toBeVisible()
    await expect(page.getByText('Continue with GitHub').first()).toBeVisible()
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('login page role selector switches role', async ({ page }) => {
    await page.goto('/login')
    await page.locator('main button:has-text("Vendor")').click()
    await expect(page).toHaveURL(/role=vendor/)
    await page.locator('main button:has-text("Admin")').click()
    await expect(page).toHaveURL(/role=admin/)
    await page.locator('main button:has-text("User")').click()
    await expect(page).toHaveURL(/role=user/)
  })

  test('register page renders with form and social buttons', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('Create Account').first()).toBeVisible()
    await expect(page.getByText('Continue with Google').first()).toBeVisible()
    await expect(page.getByText('Continue with GitHub').first()).toBeVisible()
  })
})
