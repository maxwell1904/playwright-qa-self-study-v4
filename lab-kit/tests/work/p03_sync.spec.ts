import { test, expect } from '@playwright/test';

test.fixme('P03: slow form uses actionability and a user-visible PRG oracle', async ({ page }) => {
  await page.goto('/slow-form');

  // TODO: fill the phone and click Lưu. The overlay disappears on its own.
  // TODO: prove both redirect URL and final status. Do not learn the internal delay.
  // Forbidden: waitForTimeout(), force: true, arbitrary timeout inflation.
  void expect;
});

test.fixme('P03 independent: disabled control becomes actionable', async ({ page }) => {
  await page.goto('/delayed-control');

  // TODO: click by semantic name and assert the final status.
  // Playwright should wait for the button to become enabled; the test must not know the delay.
});

test.fixme('P03 re-render: locator resolves the replacement node', async ({ page }) => {
  await page.goto('/rerender');

  // TODO: keep a Locator recipe, wait for data-generation=2, click and assert node-new outcome.
});
