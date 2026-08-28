import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonUrl } from './_target.mjs';

const module = await import(lessonUrl('js06'));

function dependencies(overrides = {}) {
  const events = [];
  const deps = {
    events,
    async fetchOrder(code) {
      events.push(`order:start:${code}`);
      await new Promise(resolve => setTimeout(resolve, 2));
      if (code === 'LD-X') throw new Error(`Order not found: ${code}`);
      events.push(`order:end:${code}`);
      return { code, customerId: 7, status: 'RECEIVED', total: 100000 };
    },
    async fetchTransactions(code) {
      events.push(`transactions:start:${code}`);
      await new Promise(resolve => setTimeout(resolve, 4));
      events.push(`transactions:end:${code}`);
      return [{ type: 'COLLECTION', amount: 20000 }];
    },
    async fetchCustomer(id) {
      events.push(`customer:start:${id}`);
      await new Promise(resolve => setTimeout(resolve, 4));
      events.push(`customer:end:${id}`);
      return { id, name: 'Nguyễn An' };
    },
    async saveTransaction(transaction) {
      events.push('save');
      return { code: 'TX-001', ...transaction };
    },
    buildReceipt(order, transaction) {
      events.push('receipt');
      return `${order.code} | ${transaction.code} | ${transaction.amount}`;
    },
    ...overrides,
  };
  return deps;
}

test('JS06 respects the order dependency then parallelizes independent reads', async () => {
  const deps = dependencies();
  const detail = await module.buildOrderDetail('LD-001', deps);
  assert.equal(detail.customer.name, 'Nguyễn An');
  assert.equal(detail.transactions.length, 1);
  assert.ok(deps.events.indexOf('order:end:LD-001') < deps.events.indexOf('transactions:start:LD-001'));
  assert.ok(deps.events.indexOf('transactions:start:LD-001') < deps.events.indexOf('customer:end:7'));
  await assert.rejects(() => module.buildOrderDetail('LD-X', deps), /LD-X/);
});

test('JS06 collection saves only after status, amount and remaining guards', async () => {
  const good = dependencies();
  assert.equal(await module.recordCollection('LD-001', 30000, good), 'LD-001 | TX-001 | 30000');
  assert.deepEqual(good.events.slice(-2), ['save', 'receipt']);

  for (const [amount, overrides, message] of [
    [0, {}, /positive/],
    [90000, {}, /remaining/],
    [1000, { fetchOrder: async () => ({ code: 'LD-001', status: 'COMPLETED', total: 100000 }) }, /COMPLETED/],
  ]) {
    const deps = dependencies(overrides);
    await assert.rejects(() => module.recordCollection('LD-001', amount, deps), message);
    assert.equal(deps.events.includes('save'), false);
  }
});
