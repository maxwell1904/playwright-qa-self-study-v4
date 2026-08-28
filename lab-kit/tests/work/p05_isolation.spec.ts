import { test, expect } from '@playwright/test';

// This shared owner is deliberately wrong. Enable both tests unchanged first.
// A fresh isolated run can look green; the combined run exposes backend state pollution.
const sharedOwner = 'p05-deliberately-shared-owner';

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ request }) => {
  // Establish a deterministic baseline once for this describe block.
  // When either test runs alone it starts clean; when both run, A pollutes B.
  await request.post(`/test-support/reset?owner=${sharedOwner}`);
});

test.fixme('P05 diagnostic A: mutates one shared backend owner', async ({ page }) => {
  await page.goto(`/customer-state?owner=${sharedOwner}`);
  await page.getByLabel('Số điện thoại mới').fill('0981111111');
  await page.getByRole('button', { name: 'Cập nhật' }).click();
  await expect(page.getByTestId('current-phone')).toHaveText('0981111111');
});

test.fixme('P05 diagnostic B: wrongly assumes the shared owner still has seed state', async ({ page }) => {
  await page.goto(`/customer-state?owner=${sharedOwner}`);
  await expect(page.getByTestId('current-phone')).toHaveText('0901234567');
});

// Repair target after evidence:
// - derive a unique owner from testInfo;
// - reset/clean only that owner;
// - keep cleanup in finally or fixture teardown;
// - repeat/reorder with at least two workers.
