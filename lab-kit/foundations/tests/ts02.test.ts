import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonUrl } from './_target.mjs';

const module = await import(lessonUrl('ts02', 'ts').href);

test('TS02 discriminated transaction variants drive label and sign', () => {
  const collection = { code: 'TX-1', type: 'COLLECTION' as const, amount: 25000, method: 'CASH' as const };
  const refund = { code: 'TX-2', type: 'REFUND' as const, amount: 5000, method: 'CASH' as const, reason: 'Nhập nhầm' };
  assert.equal(module.transactionLabel(collection), 'Thu tiền');
  assert.equal(module.transactionLabel(refund), 'Hoàn tiền: Nhập nhầm');
  assert.equal(module.signedAmount(collection), 25000);
  assert.equal(module.signedAmount(refund), -5000);
});

test('TS02 pickup decision identifies the first violated canonical guard', () => {
  const base = { role: 'STAFF', status: 'READY_FOR_PICKUP', remainingAmount: 0, issues: [] } as const;
  assert.deepEqual(module.decidePickup(base), { allowed: true });
  assert.deepEqual(module.decidePickup({ ...base, status: 'PROCESSING' }), { allowed: false, reason: 'WRONG_STATUS' });
  assert.deepEqual(module.decidePickup({ ...base, remainingAmount: 1 }), { allowed: false, reason: 'BALANCE_REMAINS' });
  assert.deepEqual(module.decidePickup({ ...base, issues: [{ status: 'OPEN' }] }), { allowed: false, reason: 'OPEN_ISSUE' });
});
