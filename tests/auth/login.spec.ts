import type { Locator, Page } from '@playwright/test';
import { test, expect } from '../../src/fixtures/auth.fixture';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

const clickIfVisible = async (locator: Locator) => {
  try {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    await locator.click();
  } catch {
    // Element never appeared; safe to ignore.
  }
};

const dismissModals = async (page: Page) => {
  await clickIfVisible(page.locator('button[aria-label="Close Welcome Banner"]'));
  await clickIfVisible(page.locator('button[aria-label="dismiss cookie message"]'));
};

test.describe('Authentication', () => {
  test('valid credentials should log in successfully via UI', async ({ page }) => {
    await page.goto('/#/login');
    await page.waitForLoadState('networkidle');
    await dismissModals(page);

    await page.fill('#email', 'demo');
    await page.fill('#password', 'demo');
    await page.click('#loginButton');

    await page.waitForURL('**/#/search', { timeout: 15000 });
    await page.locator('#navbarAccount').click();
    await expect(page.locator('#navbarLogoutButton')).toBeVisible();
  });

  test('invalid credentials should show error', async ({ page }) => {
    await page.goto('/#/login');
    await page.waitForLoadState('networkidle');
    await dismissModals(page);

    await page.fill('#email', 'bad@user');
    await page.fill('#password', 'wrong');
    await page.click('#loginButton');

    await expect(page.locator('body')).toContainText(/invalid email or password/i, { timeout: 10000 });
  });

  test('logout should clear session', async ({ browser, authStorageState }) => {
    const context = await browser.newContext({
      storageState: authStorageState,
      baseURL,
    });
    const authedPage = await context.newPage();

    await authedPage.goto('/#/search');
    await authedPage.waitForLoadState('networkidle');
    await dismissModals(authedPage);

    await authedPage.locator('#navbarAccount').click();
    await expect(authedPage.locator('#navbarLogoutButton')).toBeVisible();

    await authedPage.click('#navbarLogoutButton');
    await expect
      .poll(async () => authedPage.evaluate(() => window.localStorage.getItem('token')))
      .toBeNull();
    await authedPage.waitForTimeout(500);
    await authedPage.locator('#navbarAccount').click();
    await expect(authedPage.locator('#navbarLoginButton')).toBeVisible();

    await context.close();
  });
});
