import { test, expect } from '@playwright/test';

test.fixme('P01 completion: active KG service has the correct VND price', async ({ page }) => {
  // Test basis: a visitor must see active service name, unit and formatted price.
  // TODO 1: navigate to /services.
  // TODO 2: scope the business row named "Giặt sấy quần áo".
  // TODO 3: assert KG and 25.000 ₫ inside that row.
  // Constraints: no CSS, XPath, nth(), full-page snapshot or waitForTimeout().
  void page;
  void expect;
});

test.fixme('P01 independent: LD-002 detail opens after DOM order reverses', async ({ page }) => {
  // Arrange: /orders?order=desc.
  // Act: open the duplicate "Chi tiết" action belonging to LD-002.
  // Assert: the detail heading contains the business code.
  void page;
});
