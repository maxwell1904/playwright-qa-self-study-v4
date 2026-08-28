import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonUrl } from './_target.mjs';

const module = await import(lessonUrl('js03'));

test('JS03 line amount validates its function contract', () => {
  assert.equal(module.lineAmount(25000, 2), 50000);
  assert.throws(() => module.lineAmount(0, 2), /positive/);
  assert.throws(() => module.lineAmount(25000, -1), /positive/);
});

test('JS03 remaining uses net paid and clamps mathematical overpayment', () => {
  assert.equal(module.remainingAmount(120000, 50000, 10000), 80000);
  assert.equal(module.remainingAmount(100000, 150000, 0), 0);
});

test('JS03 maps all canonical labels and exposes unknown input', () => {
  assert.equal(module.statusLabel('RECEIVED'), 'Đã tiếp nhận');
  assert.equal(module.statusLabel('READY_FOR_PICKUP'), 'Sẵn sàng trả');
  assert.equal(module.statusLabel('CANCELLED'), 'Đã hủy');
  assert.throws(() => module.statusLabel('READY'), /Unknown order status/);
});

test('JS03 pickup completion changes one guard at a time', () => {
  assert.equal(module.canCompletePickup('READY_FOR_PICKUP', 0, false), true);
  assert.equal(module.canCompletePickup('PROCESSING', 0, false), false);
  assert.equal(module.canCompletePickup('READY_FOR_PICKUP', 1, false), false);
  assert.equal(module.canCompletePickup('READY_FOR_PICKUP', 0, true), false);
});
