import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CLB Tri Thức/i);
  });

  test('should display navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should navigate to knowledge hub', async ({ page }) => {
    await page.goto('/');
    const knowledgeLink = page.getByRole('link', { name: /kiến thức|knowledge/i });
    
    if (await knowledgeLink.isVisible().catch(() => false)) {
      await knowledgeLink.click();
      await expect(page).toHaveURL(/.*kien-thuc|.*knowledge/);
    }
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('body')).toBeVisible();
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });
});
