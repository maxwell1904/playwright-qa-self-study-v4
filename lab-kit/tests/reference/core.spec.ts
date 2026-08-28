import { test, expect } from '@playwright/test';

test('M01/M04: active service is located by business meaning', async ({ page }) => {
  await page.goto('/services');
  await expect(page.getByRole('heading', { name: 'Dịch vụ' })).toBeVisible();

  const serviceRow = page
    .getByRole('row')
    .filter({ hasText: 'Giặt sấy quần áo' });

  await expect(serviceRow).toContainText('KG');
  await expect(serviceRow).toContainText('25.000 ₫');
});

test('M04: row scope survives DOM reordering', async ({ page }) => {
  await page.goto('/orders?order=desc');

  const targetOrder = page
    .getByRole('row')
    .filter({ hasText: 'LD-002' });

  await targetOrder.getByRole('link', { name: 'Chi tiết' }).click();
  await expect(page.getByRole('heading', { name: 'Đơn LD-002' })).toBeVisible();
});

test('M05: locator re-resolves after the button node is replaced', async ({ page }) => {
  await page.goto('/rerender');
  const save = page.getByRole('button', { name: 'Lưu' });

  await expect(save).toHaveAttribute('data-generation', '2');
  await save.click();

  await expect(page.getByRole('status')).toHaveText('Đã lưu bởi node mới');
});

test('M03/M05: actionability and user-visible outcome replace sleep', async ({ page }) => {
  await page.goto('/slow-form');
  await page.getByLabel('Số điện thoại').fill('0912345678');
  await page.getByRole('button', { name: 'Lưu' }).click();

  await expect(page).toHaveURL(/saved=1/);
  await expect(page.getByRole('status')).toHaveText('Đã lưu 0912345678');
});

test('M06: test owns a distinct backend data identity', async ({ page, request }, testInfo) => {
  const owner = `reference-${testInfo.workerIndex}-${testInfo.repeatEachIndex}-${testInfo.title.replaceAll(/\W/g, '-')}`;
  await request.post(`/test-support/reset?owner=${encodeURIComponent(owner)}`);

  await page.goto(`/customer-state?owner=${encodeURIComponent(owner)}`);
  await expect(page.getByTestId('current-phone')).toHaveText('0901234567');
  await page.getByLabel('Số điện thoại mới').fill('0987654321');
  await page.getByRole('button', { name: 'Cập nhật' }).click();
  await expect(page.getByTestId('current-phone')).toHaveText('0987654321');
});
