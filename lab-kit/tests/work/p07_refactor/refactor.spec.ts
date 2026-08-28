import { test, expect, type Page } from '@playwright/test';

async function openOrderCopyOne(page: Page, orderCode: string) {
  await page.goto('/orders');
  const row = page.getByRole('row').filter({ hasText: orderCode });
  await row.getByRole('link', { name: 'Chi tiết' }).click();
  await expect(page.getByRole('heading', { name: `Đơn ${orderCode}` })).toBeVisible();
}

async function openOrderCopyTwo(page: Page, orderCode: string) {
  await page.goto('/orders?order=desc');
  const row = page.getByRole('row').filter({ hasText: orderCode });
  await row.getByRole('link', { name: 'Chi tiết' }).click();
  await expect(page.getByRole('heading', { name: `Đơn ${orderCode}` })).toBeVisible();
}

test.fixme('P07 starter: opens LD-001 through duplicated domain behavior', async ({ page }) => {
  await openOrderCopyOne(page, 'LD-001');
});

test.fixme('P07 starter: opens LD-003 after DOM reorder', async ({ page }) => {
  await openOrderCopyTwo(page, 'LD-003');
});

test.fixme('P07 refactor gate: behavior survives one task helper extraction', async ({ page }) => {
  // After the two starter tests are green, replace copy-one/copy-two with one named task helper.
  // Keep its business oracle. Then add one data builder and one owned-state fixture only when
  // their duplication/lifecycle is visible in this suite.
  void page;
});
