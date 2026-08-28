import { test, expect } from '@playwright/test';

test.fixme('P09-B1 seeded: missing awaits create a test-code race', async ({ page }) => {
  // Intentionally broken. Predict the first symptom before running.
  page.goto('/slow-form');
  page.getByLabel('Số điện thoại').fill('0912345678');
  page.getByRole('button', { name: 'Lưu' }).click();
  expect(page.getByRole('status')).toHaveText('Đã lưu 0912345678');
});
