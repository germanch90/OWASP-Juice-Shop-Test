import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectFirstProduct() {
    const firstCard = this.page.locator('mat-card').first();
    await firstCard.waitFor({ state: 'visible' });
    const name = (await firstCard.locator('mat-card-title, .item-name').first().innerText()).trim();
    const priceText = (
      await firstCard.locator('text=/\\d+(\\.\\d+)?¤/').first().innerText()
    ).trim();
    await firstCard.click();
    await this.page.waitForSelector('app-product-details', { timeout: 10000 });
    return { name, priceText };
  }

  async addToCart() {
    const addButton = this.page.locator('button[aria-label="Add to Basket"]');
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();
    const snackBar = this.page.locator('snack-bar-container simple-snack-bar');
    await expect(snackBar).toContainText(/basket/i);
    await snackBar.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  }
}
