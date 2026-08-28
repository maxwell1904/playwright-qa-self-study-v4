import { test, expect } from '@playwright/test';
import { openOrderByCode, type OrderScenario } from '../../../foundations/reference/ts04.ts';

test('TS04 completion: typed scenario opens the exact order detail', async ({ page }) => {
  const scenario: OrderScenario = {
    code: 'LD-002',
    expectedCustomer: 'Trần Bình',
    expectedStatus: 'PROCESSING',
  };
  await page.goto('/orders');
  await openOrderByCode(page, scenario.code);
  await expect(page.getByRole('heading', { name: `Đơn ${scenario.code}` })).toBeVisible();
  await expect(page.getByText(scenario.expectedCustomer)).toBeVisible();
  await expect(page.getByText('Đang xử lý')).toBeVisible();
});
