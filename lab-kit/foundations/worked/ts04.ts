import type { Page } from '@playwright/test';

type OrderScenario = {
  readonly code: string;
  readonly expectedHeading: string;
};

export async function openOrderByCode(page: Page, code: string): Promise<void> {
  const row = page.getByRole('row').filter({ hasText: code });
  await row.getByRole('link', { name: 'Chi tiết' }).click();
}

const scenario: OrderScenario = {
  code: 'LD-002',
  expectedHeading: 'Đơn LD-002'
};

console.log(`Typed scenario ready: ${scenario.code} -> ${scenario.expectedHeading}`);
