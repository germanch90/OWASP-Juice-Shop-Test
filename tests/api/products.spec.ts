import { test, expect } from '../../src/fixtures/api.fixture';
import { ProductListSchema } from '../../src/api/schemas/product.schema';

test.describe('API: /rest/products/search', () => {
  const endpoint = '/rest/products/search?q=';

  test('should return product list with valid schema', async ({ api }) => {
    const response = await api.get(endpoint);
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json.status).toBe('success');

    const parsed = ProductListSchema.safeParse(json.data);

    expect(parsed.success, JSON.stringify(parsed.error, null, 2)).toBe(true);
  });

  test('should return non-empty list', async ({ api }) => {
    const response = await api.get(endpoint);
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });
});
