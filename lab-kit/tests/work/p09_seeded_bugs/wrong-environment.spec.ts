import { test, expect } from '@playwright/test';

test.fixme('P09-B4 seeded: wrong environment is not a locator failure', async ({ request }) => {
  const wrongBaseURL = process.env.P09_WRONG_BASE_URL ?? 'http://127.0.0.1:9';

  // Intentionally points to an unreachable service. Do not increase test timeout.
  const response = await request.get(`${wrongBaseURL}/health`);
  expect(response.status()).toBe(200);
});
