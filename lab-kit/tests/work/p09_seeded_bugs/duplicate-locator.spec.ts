import { test, expect } from '@playwright/test';

test.fixme('P09-B2 seeded: duplicate action text needs a business scope', async ({ page }) => {
  await page.goto('/orders?order=desc');

  // Intentionally ambiguous: three links have the same accessible name.
  await page.getByRole('link', { name: 'Chi tiết' }).click();
  await expect(page.getByRole('heading', { name: 'Đơn LD-002' })).toBeVisible();
});
