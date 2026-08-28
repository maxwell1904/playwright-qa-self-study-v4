import { test, expect, type Page } from '@playwright/test';

async function login(page: Page, username: 'staff' | 'manager') {
  await page.goto('/login');
  await page.getByLabel('Tên đăng nhập').fill(username);
  await page.getByLabel('Mật khẩu').fill('lab');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
  await expect(page.getByRole('heading', { name: 'Bảng điều khiển' })).toBeVisible();
}

test.fixme('P06: anonymous Manager request redirects to login', async ({ request }) => {
  // TODO: issue GET /manager without following redirects; assert exact status and Location.
  void request;
});

test.fixme('P06: STAFF is forbidden by the protected route', async ({ page }) => {
  await login(page, 'staff');

  // TODO: call /manager and prove HTTP 403 plus the user-visible 403 heading.
});

test.fixme('P06: MANAGER is allowed', async ({ page }) => {
  await login(page, 'manager');

  // TODO: prove /manager is accessible; do not stop at a visible menu assertion.
});

test.fixme('P06: a MANAGER mutation without CSRF is rejected', async ({ page }) => {
  await login(page, 'manager');

  // TODO: use fetch from the authenticated browser context to POST /manager/reset-demo
  // without the hidden token; assert 403. Do not log cookies.
});
