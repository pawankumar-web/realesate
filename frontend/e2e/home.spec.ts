import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads the page and shows essential elements', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('shows HeroSection with headline', async ({ page }) => {
    await expect(page.getByText('Find Homes').first()).toBeVisible()
  })

  test('shows LiveActivityBar', async ({ page }) => {
    await expect(page.getByText('LIVE').first()).toBeVisible()
  })

  test('shows featured properties section', async ({ page }) => {
    await expect(page.getByText('Featured Properties').first()).toBeVisible()
  })

  test('navigation to properties page works', async ({ page }) => {
    await page.getByRole('link', { name: /properties/i }).first().click()
    await page.waitForURL('**/properties')
    await expect(page.getByText('Properties').first()).toBeVisible()
  })
})
