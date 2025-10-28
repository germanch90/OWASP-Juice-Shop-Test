import { test as base, request } from 'playwright/test';
import fs from 'fs';
import path from 'path';

export type AuthFixtures = {
  authStorageState: string;
};

export const test = base.extend<AuthFixtures>({
  authStorageState: async ({}, use) => {
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    const contextRequest = await request.newContext({ baseURL });

    const response = await contextRequest.post('/rest/user/login', {
      data: { email: 'demo', password: 'demo' }
    });

    if (!response.ok()) {
      throw new Error('Login failed');
    }

    const authBody = await response.json();
    const storageState = await contextRequest.storageState();
    const origin = new URL(baseURL).origin;
    const localStorageEntries = [
      { name: 'token', value: authBody.authentication?.token ?? '' },
      { name: 'bid', value: String(authBody.authentication?.bid ?? '') },
      { name: 'umail', value: authBody.authentication?.umail ?? 'demo' }
    ];

    const existingOrigin = storageState.origins?.find((entry) => entry.origin === origin);
    if (existingOrigin) {
      existingOrigin.localStorage = localStorageEntries;
    } else {
      storageState.origins = [
        ...(storageState.origins ?? []),
        { origin, localStorage: localStorageEntries }
      ];
    }

    const statePath = path.join('test-results', 'auth-storage.json');
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(statePath, JSON.stringify(storageState, null, 2));
    await use(statePath);
    await contextRequest.dispose();
  },
});

export const expect = test.expect;
