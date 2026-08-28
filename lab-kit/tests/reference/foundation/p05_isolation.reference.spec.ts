import { test, expect } from '@playwright/test';

function ownedId(testInfo: { workerIndex: number; retry: number; testId: string }) {
  return `p05-w${testInfo.workerIndex}-r${testInfo.retry}-${testInfo.testId}`
    .replaceAll(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 80);
}

test('P05 reference owns and cleans only its backend state', async ({ page, request }, testInfo) => {
  const owner = ownedId(testInfo);
  await request.post(`/test-support/reset?owner=${owner}`);
  try {
    await page.goto(`/customer-state?owner=${owner}`);
    await page.getByLabel('Số điện thoại mới').fill('0981111111');
    await page.getByRole('button', { name: 'Cập nhật' }).click();
    await expect(page.getByTestId('current-phone')).toHaveText('0981111111');
  } finally {
    await request.post(`/test-support/reset?owner=${owner}`);
  }
});
