import { test, expect } from '@playwright/test';

const sharedOwner = 'p09-shared-owner';

test.describe.configure({ mode: 'parallel' });

test.fixme('P09-B3A seeded: mutates a shared backend owner', async ({ page }) => {
  await page.goto(`/customer-state?owner=${sharedOwner}`);
  await page.getByLabel('Số điện thoại mới').fill('0981111111');
  await page.getByRole('button', { name: 'Cập nhật' }).click();
  await expect(page.getByTestId('current-phone')).toHaveText('0981111111');
});

test.fixme('P09-B3B seeded: assumes the same owner still has seed state', async ({ page }) => {
  await page.goto(`/customer-state?owner=${sharedOwner}`);
  await expect(page.getByTestId('current-phone')).toHaveText('0901234567');
});
