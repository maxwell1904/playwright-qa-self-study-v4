import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonUrl, target } from './_target.mjs';

test('JS01 completion derives remaining, payment flag and label from the inputs', async () => {
  const value = await import(lessonUrl('js01'));
  assert.equal(value.remainingAmount, 70000);
  assert.equal(value.fullyPaid, false);
  assert.equal(value.label, 'LD-20260813-000123 | Trần Thu Hà | remaining 70000 VND');
});

test('JS01 independent snapshot keeps identity, unit, amount and quantity type observable', async () => {
  const module = await import(new URL(`../${target}/js01_service_snapshot.mjs`, import.meta.url));
  assert.equal(module.lineAmount, module.unitPrice * module.quantity);
  assert.ok(module.serviceCode.length > 2);
  assert.ok(['KG', 'ITEM'].includes(module.pricingUnit));
  assert.equal(module.active, true);
  assert.equal(typeof module.quantity, 'number');
});
