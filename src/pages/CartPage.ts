import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  private readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartButton = page.locator('button[aria-label="Show the shopping cart"]');
  }

  async open() {
    await this.cartButton.click();
    await this.page.waitForURL('**/#/basket', { timeout: 10000 });
  }

  async verifyItemCount(count: number) {
    const badge = this.cartButton.locator('span.mat-badge-content');
    await expect(badge).toHaveText(String(count));
    const basketRows = this.page.locator('app-basket-item');
    await expect(basketRows).toHaveCount(count);
  }

  async verifyItemPrice(name: string, expectedPrice: string) {
    const itemRow = this.page.locator('app-basket-item').filter({ hasText: name });
    await expect(itemRow).toBeVisible();
    const escaped = expectedPrice.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(itemRow.locator('.mat-column-total, .mat-column-price')).toContainText(
      new RegExp(escaped)
    );
  }
}
