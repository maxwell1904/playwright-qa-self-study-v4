import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeStoredPhone, deriveBalance } from './js07.mjs';

test('normalizes plain, separated and +84 stored phone without mutating input', () => {
  const input = '+84 912-345-678';
  assert.equal(normalizeStoredPhone('0912345678'), '0912345678');
  assert.equal(normalizeStoredPhone('091.234 5678'), '0912345678');
  assert.equal(normalizeStoredPhone(input), '0912345678');
  assert.equal(input, '+84 912-345-678');
});

test('rejects short, wrong-prefix and alphabetic stored phone', () => {
  assert.throws(() => normalizeStoredPhone('09123'), /10 digits/);
  assert.throws(() => normalizeStoredPhone('1912345678'), /10 digits/);
  assert.throws(() => normalizeStoredPhone('09abc45678'), /10 digits/);
});

test('derives collection/refund balance and clamps mathematical overpayment', () => {
  assert.deepEqual(deriveBalance(100000, []), { collected: 0, refunded: 0, netPaid: 0, remaining: 100000 });
  assert.deepEqual(deriveBalance(100000, [{ type: 'COLLECTION', amount: 40000 }]), { collected: 40000, refunded: 0, netPaid: 40000, remaining: 60000 });
  assert.deepEqual(deriveBalance(100000, [{ type: 'COLLECTION', amount: 120000 }, { type: 'REFUND', amount: 10000 }]), { collected: 120000, refunded: 10000, netPaid: 110000, remaining: 0 });
});

test('ledger rejects unknown type and does not mutate transaction rows', () => {
  const rows = [{ type: 'COLLECTION', amount: 30000 }, { type: 'REFUND', amount: 5000 }];
  const before = structuredClone(rows);
  assert.deepEqual(deriveBalance(100000, rows), { collected: 30000, refunded: 5000, netPaid: 25000, remaining: 75000 });
  assert.deepEqual(rows, before);
  assert.throws(() => deriveBalance(1, [{ type: 'ADJUST', amount: 1 }]), /ADJUST/);
});
