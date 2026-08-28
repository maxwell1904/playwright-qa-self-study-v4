import { test, expect, type Page } from '@playwright/test';

async function login(page: Page, username: 'staff' | 'manager') {
  await page.goto('/login');
  await page.getByLabel('Tên đăng nhập').fill(username);
  await page.getByLabel('Mật khẩu').fill('lab');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page.getByRole('heading', { name: 'Bảng điều khiển' })).toBeVisible();
}

test('M07: anonymous protected request redirects to login', async ({ request }) => {
  const response = await request.get('/manager', { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  expect(response.headers().location).toBe('/login');
});

test('M07: authenticated STAFF receives 403 on Manager page', async ({ page }) => {
  await login(page, 'staff');
  const response = await page.goto('/manager');
  expect(response?.status()).toBe(403);
  await expect(page.getByRole('heading', { name: '403' })).toBeVisible();
});

test('M07: MANAGER is allowed and missing CSRF is rejected', async ({ page }) => {
  await login(page, 'manager');
  await page.goto('/manager');
  await expect(page.getByRole('heading', { name: 'Quản lý' })).toBeVisible();

  const status = await page.evaluate(async () => {
    const response = await fetch('/manager/reset-demo', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: '',
      redirect: 'manual',
    });
    return response.status;
  });

  expect(status).toBe(403);
});
