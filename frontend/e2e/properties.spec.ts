import { test, expect } from '@playwright/test'

test.describe('Property Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/properties')
    await page.waitForLoadState('networkidle')
  })

  test('loads property listing with search', async ({ page }) => {
    await expect(page.getByPlaceholder(/search/i).first()).toBeVisible()
  })

  test('filter pills are displayed', async ({ page }) => {
    const pills = ['All', 'Buy', 'Rent', 'Commercial', 'Premium', 'New Launch']
    for (const pill of pills) {
      await expect(page.getByRole('button', { name: pill, exact: true }).first()).toBeVisible()
    }
  })

  test('clicking a filter pill updates URL', async ({ page }) => {
    await page.getByRole('button', { name: 'Premium', exact: true }).click()
    await expect(page).toHaveURL(/filter=Premium/)
  })

  test('search input filters properties', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i).first()
    await searchInput.fill('Luxury')
    await page.waitForTimeout(300)
  })
})
