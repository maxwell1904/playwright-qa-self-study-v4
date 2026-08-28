import { test, expect } from '@playwright/test';

test.fixme('P02: locators describe service and order business identity', async ({ page }) => {
  // Complete both contracts in one learning test, then decide whether they should be split.
  // 1. On /services, scope a row by the service name and assert its unit/price.
  // 2. On /orders?order=desc, scope LD-002 before clicking "Chi tiết".
  // 3. Prove the final heading. Do not silence strictness with first()/nth().
  void page;
  void expect;
});

test.fixme('P02 failure injection: explain a deliberate strictness error', async ({ page }) => {
  await page.goto('/orders');

  // Deliberately activate this ambiguous action first. Preserve its call log in DEBUG_JOURNAL.md,
  // then replace it with a locator scoped to a business row.
  // await page.getByRole('link', { name: 'Chi tiết' }).click();
});
