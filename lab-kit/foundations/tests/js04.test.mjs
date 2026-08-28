import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonUrl } from './_target.mjs';

const module = await import(lessonUrl('js04'));

test('JS04 completion uses business queries over the order array', () => {
  assert.equal(module.targetOrder?.code, 'LD-003');
  assert.deepEqual(module.receivedOrders.map(order => order.code), ['LD-001', 'LD-004']);
  assert.deepEqual(module.codes, ['LD-001', 'LD-002', 'LD-003', 'LD-004']);
  assert.equal(module.totalValue, 325000);
  assert.equal(module.allHaveCodes, true);
});

test('JS04 independent queries survive reorder and reject missing identity', () => {
  const nested = [
    { code: 'LD-A', status: 'COMPLETED', customer: { name: 'A', phone: '0901' }, items: [], issues: [] },
    { code: 'LD-B', status: 'PROCESSING', customer: { name: 'B', phone: '0902' }, items: [{ serviceCode: 'S1' }], issues: [{ status: 'OPEN' }] },
  ];
  assert.equal(module.findOrderByCode([...nested].reverse(), 'LD-B').customer.name, 'B');
  assert.throws(() => module.findOrderByCode(nested, 'LD-X'), /LD-X/);
  assert.deepEqual(module.activeOrderCodes([...nested].reverse()), ['LD-B']);
  assert.equal(module.hasOpenIssue(nested[1]), true);
});

test('JS04 ledger and summary are derived without mutating inputs', () => {
  const transactions = [{ type: 'COLLECTION', amount: 90000 }, { type: 'REFUND', amount: 10000 }];
  const before = structuredClone(transactions);
  assert.deepEqual(module.deriveLedger(transactions), { collected: 90000, refunded: 10000, netPaid: 80000 });
  assert.deepEqual(transactions, before);
  assert.throws(() => module.deriveLedger([{ type: 'ADJUST', amount: 1 }]), /Unknown transaction type/);

  const order = { code: 'LD-B', status: 'PROCESSING', customer: { name: 'B', phone: '0902' }, items: [{ serviceCode: 'S1' }] };
  const summary = module.snapshotSummary(order);
  assert.notEqual(summary, order);
  assert.notEqual(summary.customer, order.customer);
  assert.deepEqual(summary.serviceCodes, ['S1']);
});
