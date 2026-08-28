import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';

const sampleFile = fileURLToPath(new URL('../fixtures/sample-note.txt', import.meta.url));

test.fixme('P04: form controls produce a semantic summary', async ({ page }) => {
  await page.goto('/controls');

  // TODO: fill phone 0912345678.
  // TODO: select KG by its label.
  // TODO: check acknowledgement by its accessible name.
  // TODO: attach sampleFile and submit.
  // TODO: assert status includes phone, KG, acknowledgement and sample-note.txt.
  void sampleFile;
  void expect;
});

test.fixme('P04 negative: invalid phone keeps safe input and shows no ready outcome', async ({ page }) => {
  await page.goto('/controls');

  // Arrange all controls, but use phone "abc".
  // Assert the precise validation message, retained phone value and data-outcome="invalid".
});
