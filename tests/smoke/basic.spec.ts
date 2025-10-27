import { test, expect } from '@playwright/test';
import { text } from 'stream/consumers';

test.describe('Smoke: Home page', () => {
  test('should load OWASP Juice Shop home page and have correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/OWASP Juice Shop/i);
    await expect(page.getByRole('button', {name: 'Open Sidenav'})).toBeVisible({ timeout: 5000 });
  });
});
