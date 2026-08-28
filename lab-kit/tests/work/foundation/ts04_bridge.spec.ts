import { test, expect } from '@playwright/test';
import { openOrderByCode, type OrderScenario } from '../../../foundations/work/ts04.ts';

test.fixme('TS04 completion: typed scenario opens the exact order detail', async ({ page }) => {
  const scenario: OrderScenario = {
    code: 'LD-002',
    expectedCustomer: 'Trần Bình',
    expectedStatus: 'PROCESSING',
  };
  // TODO navigate, await the typed helper, then assert the exact heading/customer/status.
  void page;
  void scenario;
  void openOrderByCode;
  void expect;
});
