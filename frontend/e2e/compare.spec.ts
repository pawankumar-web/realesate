import { test, expect } from '@playwright/test'

test.describe('Compare Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/properties')
    await page.waitForLoadState('networkidle')
  })

  test('compare page loads when navigated directly', async ({ page }) => {
    await page.goto('/compare')
    await expect(page.getByText('Compare Properties').first()).toBeVisible()
  })
})
