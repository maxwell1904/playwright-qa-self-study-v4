import { test, expect } from '@playwright/test';

type Service = {
  code: string;
  name: string;
  unit: 'KG' | 'ITEM';
  price: number;
  active: boolean;
};

function parseServices(value: unknown): Service[] {
  // TODO P08: replace this deliberate stub with runtime checks.
  // A TypeScript cast is not runtime validation.
  if (!Array.isArray(value)) throw new Error('Expected an array');
  return value as Service[];
}

const apiHeaders = {
  authorization: `Bearer ${process.env.LAB_API_TOKEN ?? 'lab-api-token'}`,
};

test.fixme('P08: services API returns runtime-valid active business fields', async ({ request }) => {
  const response = await request.get('/api/services');

  // TODO: assert status, content-type, runtime shape and one stable business object.
  // Do not stop at response.ok().
  const body: unknown = await response.json();
  const services = parseServices(body);
  void services;
  void expect;
});

test.fixme('P08: invalid customer update is rejected without a side effect', async ({ request }, testInfo) => {
  const owner = `p08-invalid-${testInfo.workerIndex}-${testInfo.retry}`;

  // TODO: PUT /api/customers/:owner with the Bearer token and an invalid phone.
  // Assert 400 + error contract, then prove GET remains 404.
  void request;
  void owner;
});

test.fixme('P08 hybrid: API owns data and UI renders the updated phone', async ({ page, request }, testInfo) => {
  const owner = `p08-hybrid-${testInfo.workerIndex}-${testInfo.retry}`;
  const resource = `/api/customers/${encodeURIComponent(owner)}`;

  // TODO arrange: authenticated PUT { phone: '0987654321' }, assert 201/Location/body.
  // TODO UI assert: /customer-state?owner=... renders the phone.
  // TODO cleanup: DELETE only this resource, ideally in finally/fixture teardown.
  void page;
  void request;
  void resource;
  void apiHeaders;
});

test.fixme('P08 authorization: private customer resource rejects a missing token', async ({ request }) => {
  // TODO: GET a customer resource without Authorization and assert 401 + JSON error code.
  void request;
});
