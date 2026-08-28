import type { Page } from '@playwright/test';

export type OrderScenario = Readonly<{
  code: string;
  expectedCustomer: string;
  expectedStatus: 'RECEIVED' | 'PROCESSING' | 'READY_FOR_PICKUP';
}>;

export async function openOrderByCode(page: Page, code: string): Promise<void> {
  const codeHeader = page.getByRole('rowheader', { name: code, exact: true });
  const row = page.getByRole('row').filter({ has: codeHeader });
  await row.getByRole('link', { name: 'Chi tiết', exact: true }).click();
}

export async function runOrderScenario(
  page: Page,
  scenario: OrderScenario,
  assertDetail: (page: Page, scenario: OrderScenario) => Promise<void>,
): Promise<void> {
  await page.goto('/orders');
  await openOrderByCode(page, scenario.code);
  await assertDetail(page, scenario);
}
