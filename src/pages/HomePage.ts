import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchIcon: Locator;
  readonly searchBar: Locator;
  readonly cookieDismiss: Locator;
  readonly welcomeDismiss: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchIcon = page.getByText('search');
    this.searchBar = page.locator('#mat-input-1');
    this.cookieDismiss = page.locator('button[aria-label="dismiss cookie message"]');
    this.welcomeDismiss = page.locator('button[aria-label="Close Welcome Banner"]');
  }

  async open() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    await this.dismissPopups();
  }

  private async dismissPopups() {
    for (const locator of [this.cookieDismiss, this.welcomeDismiss]) {
      if (await locator.isVisible().catch(() => false)) {
        await locator.click();
      }
    }
  }

  async searchFor(term: string) {
    if (!(await this.searchBar.isVisible())) {
      await this.dismissPopups();
    }
    await this.searchIcon.click();
    await this.searchBar.fill(term);
    await this.page.keyboard.press('Enter');
    await this.page.waitForURL('**/#/search*', { timeout: 10000 });
  }
}
