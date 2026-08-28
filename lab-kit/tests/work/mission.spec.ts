import { test, expect } from '@playwright/test';

test.fixme('M01: visitor sees an active service', async ({ page }) => {
  // TODO: navigate to /services and prove one named service has the correct unit and price.
  // Constraint: semantic locators only; no CSS/XPath/nth().
});

test.fixme('M02: repair the missing awaits', async ({ page }) => {
  // This is intentionally wrong. Predict the symptoms before changing it.
  page.goto('/slow-form');
  page.getByLabel('Số điện thoại').fill('0912345678');
  page.getByRole('button', { name: 'Lưu' }).click();
  expect(page.getByRole('status')).toHaveText('Đã lưu 0912345678');
});

test.fixme('M04: open LD-002 after order rows are reversed', async ({ page }) => {
  await page.goto('/orders?order=desc');
  // TODO: scope the business row before the duplicate "Chi tiết" action.
});

test.fixme('M05: save through re-render without sleeping', async ({ page }) => {
  await page.goto('/rerender');
  // TODO: use locator re-resolution and assert the node-2 visible outcome.
});

test.fixme('M06: own backend data and survive reordered execution', async ({ page }, testInfo) => {
  // TODO: create an owner identity from testInfo, use /customer-state?owner=..., update it,
  // and prove the final phone. Add explicit reset only for the owner this test owns.
});

test.fixme('M07: prove anonymous, STAFF, MANAGER and CSRF boundaries', async ({ page, request }) => {
  // TODO: split this into focused tests or a clearly-labeled matrix.
  // Expected outcomes: anonymous 302, STAFF 403, MANAGER 200, missing CSRF 403.
});
