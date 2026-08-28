import { test, expect } from '@playwright/test';

test('JS08 completion: visitor sees the ironing service by semantic business identity', async ({ page }) => {
  await page.goto('/services');
  const row = page.getByRole('row').filter({ hasText: 'Ủi quần áo' });
  await expect(row).toContainText('ITEM');
  await expect(row).toContainText('12.000 ₫');
});

test('JS08 independent: opens LD-001 correctly after descending reorder', async ({ page }) => {
  await page.goto('/orders?order=desc');
  const row = page.getByRole('row').filter({ hasText: 'LD-001' });
  await row.getByRole('link', { name: 'Chi tiết' }).click();
  await expect(page.getByRole('heading', { name: 'Đơn LD-001' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Đơn LD-002' })).toHaveCount(0);
});
