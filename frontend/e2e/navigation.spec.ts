import { test, expect } from '@playwright/test'

const PUBLIC_PAGES = [
  { path: '/', title: /find your dream|estate/i },
  { path: '/properties', title: /properties/i },
  { path: '/agents', title: /agents?/i },
  { path: '/about', title: /about/i },
  { path: '/contact', title: /contact/i },
  { path: '/blog', title: /blog/i },
  { path: '/faq', title: /faq/i },
  { path: '/compare', title: /compare/i },
  { path: '/login', title: /sign in|login/i },
  { path: '/register', title: /create an account|register/i },
  { path: '/subscription-plans', title: /subscription|plans/i },
]

test.describe('Navigation — All Public Pages', () => {
  for (const { path, title } of PUBLIC_PAGES) {
    test(`loads ${path} without crashing`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      await expect(page.locator('header')).toBeVisible()
    })
  }
})
