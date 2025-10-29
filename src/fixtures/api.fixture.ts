import { test as base, request } from '@playwright/test';

export const test = base.extend({
  api: async ({}, use) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    const api = await request.newContext({ baseURL });
    await use(api);
    await api.dispose();
  },
});

export const expect = base.expect;
