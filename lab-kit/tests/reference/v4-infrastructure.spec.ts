import { test, expect } from '@playwright/test';

const apiHeaders = { authorization: 'Bearer lab-api-token' };

test('v4/P03: delayed control becomes actionable without a fixed wait', async ({ page }) => {
  await page.goto('/delayed-control?delay=300');

  await page.getByRole('button', { name: 'Tiếp tục' }).click();
  await expect(page.getByRole('status')).toHaveText('Đã tiếp tục khi control sẵn sàng');
});

test('v4/P04: controls route accepts semantic input and reports the selected file', async ({ page }) => {
  await page.goto('/controls');

  await page.getByLabel('Số điện thoại').fill('0912345678');
  await page.getByLabel('Đơn vị tính').selectOption('KG');
  await page.getByRole('checkbox', { name: 'Tôi xác nhận dữ liệu practice' }).check();
  await page.getByLabel('Tệp ghi chú').setInputFiles({
    name: 'reference-note.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('reference infrastructure only'),
  });
  await page.getByRole('button', { name: 'Tạo tóm tắt' }).click();

  await expect(page.getByRole('status')).toHaveAttribute('data-outcome', 'ready');
  await expect(page.getByRole('status')).toContainText('0912345678 | KG | đã xác nhận | reference-note.txt');
});

test('v4/P08: practice services API exposes stable runtime business fields', async ({ request }) => {
  const response = await request.get('/api/services');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  const body: unknown = await response.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body).toEqual(expect.arrayContaining([
    expect.objectContaining({
      code: 'GIAT_SAY_KG',
      name: 'Giặt sấy quần áo',
      unit: 'KG',
      price: 25_000,
      active: true,
    }),
  ]));
});

test('v4/P08: owned customer API validates auth, persists once and cleans its resource', async ({ page, request }, testInfo) => {
  const owner = `reference-api-w${testInfo.workerIndex}-${testInfo.retry}-${testInfo.testId}`
    .replaceAll(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 80);
  const resource = `/api/customers/${encodeURIComponent(owner)}`;

  const unauthorized = await request.get(resource);
  expect(unauthorized.status()).toBe(401);
  expect(await unauthorized.json()).toMatchObject({ error: { code: 'UNAUTHORIZED' } });

  try {
    const create = await request.put(resource, {
      headers: apiHeaders,
      data: { phone: '0987654321' },
    });
    expect(create.status()).toBe(201);
    expect(create.headers().location).toBe(resource);
    expect(await create.json()).toEqual({ owner, phone: '0987654321' });

    await page.goto(`/customer-state?owner=${encodeURIComponent(owner)}`);
    await expect(page.getByTestId('current-phone')).toHaveText('0987654321');
  } finally {
    const cleanup = await request.delete(resource, { headers: apiHeaders });
    expect([204, 404]).toContain(cleanup.status());
  }
});

test('v4/API: disposable task contract supports create, read, transition and cleanup', async ({ request }, testInfo) => {
  const title = `reference-${testInfo.workerIndex}-${testInfo.retry}-${testInfo.testId}`.slice(0, 80);
  const create = await request.post('/tasks', { data: { title, priority: 'HIGH' } });

  expect(create.status()).toBe(201);
  expect(create.headers()['content-type']).toContain('application/json');
  const task = await create.json() as { id: string; title: string; priority: string; status: string };
  expect(task).toMatchObject({ title, priority: 'HIGH', status: 'OPEN' });
  expect(create.headers().location).toBe(`/tasks/${task.id}`);

  try {
    const duplicate = await request.post('/tasks', { data: { title, priority: 'LOW' } });
    expect(duplicate.status()).toBe(409);
    expect(await duplicate.json()).toMatchObject({ error: { code: 'DUPLICATE_TITLE' } });

    const read = await request.get(`/tasks/${task.id}`);
    expect(read.status()).toBe(200);
    expect(await read.json()).toEqual(task);

    const complete = await request.patch(`/tasks/${task.id}`, { data: { status: 'DONE' } });
    expect(complete.status()).toBe(200);
    expect(await complete.json()).toMatchObject({ id: task.id, status: 'DONE' });

    const repeat = await request.patch(`/tasks/${task.id}`, { data: { status: 'DONE' } });
    expect(repeat.status()).toBe(409);
  } finally {
    const cleanup = await request.delete(`/tasks/${task.id}`);
    expect([204, 404]).toContain(cleanup.status());
  }
});
