import type { Page } from '@playwright/test';

export type OrderScenario = Readonly<{
  code: string;
  expectedCustomer: string;
  expectedStatus: 'RECEIVED' | 'PROCESSING' | 'READY_FOR_PICKUP';
}>;

export async function openOrderByCode(page: Page, code: string): Promise<void> {
  // TODO scope a semantic row by exact business-code rowheader and await the click.
  void code;
  void page;
}

export async function runOrderScenario(
  page: Page,
  scenario: OrderScenario,
  assertDetail: (page: Page, scenario: OrderScenario) => Promise<void>,
): Promise<void> {
  // TODO await navigation, helper and assertion callback in dependency order.
  void page;
  void scenario;
  void assertDetail;
}
