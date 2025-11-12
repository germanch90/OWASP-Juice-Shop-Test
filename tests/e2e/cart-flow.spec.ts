import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { ProductPage } from '../../src/pages/ProductPage';
import { CartPage } from '../../src/pages/CartPage';

test.describe('E2E: Product to Cart Flow', () => {
  test('user can search, view product, add to cart, and persist state', async ({ page }) => {
    const home = new HomePage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);

    await home.open();
    await home.searchFor('apple');
    const { name, priceText } = await product.selectFirstProduct();
    await product.addToCart();
    await cart.open();

    await cart.verifyItemCount(1);
    await cart.verifyItemPrice(name, priceText);

    await page.reload();
    await cart.open();
    await cart.verifyItemCount(1);
    await cart.verifyItemPrice(name, priceText);

    await expect(page.locator('app-basket')).toContainText(name);
  });
});
