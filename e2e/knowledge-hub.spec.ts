import { test, expect } from '@playwright/test';

test.describe('Knowledge Hub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kien-thuc');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/kiến thức|knowledge/i);
  });

  test('should have working category tabs', async ({ page }) => {
    const tabs = page.getByRole('tab');
    const count = await tabs.count();
    
    if (count > 1) {
      await tabs.nth(1).click();
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('should display articles or empty state', async ({ page }) => {
    const articles = page.locator('[data-testid="article-card"]').or(page.getByText(/không có|empty|no articles/i));
    await expect(articles.first()).toBeVisible();
  });
});
