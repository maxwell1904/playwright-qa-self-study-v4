import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonUrl } from './_target.mjs';

const module = await import(lessonUrl('ts03', 'ts').href);

test('TS03 parses both transaction variants at the unknown boundary', () => {
  assert.deepEqual(module.parseTransaction({ type: 'COLLECTION', amount: 1, method: 'CASH' }), { type: 'COLLECTION', amount: 1, method: 'CASH' });
  assert.deepEqual(module.parseTransaction({ type: 'REFUND', amount: 2, method: 'BANK_TRANSFER_MANUAL', reason: 'Sai số tiền' }), { type: 'REFUND', amount: 2, method: 'BANK_TRANSFER_MANUAL', reason: 'Sai số tiền' });
});

test('TS03 rejects at least six invalid external transaction shapes', () => {
  for (const value of [null, [], {}, { type: 'COLLECTION', amount: 0, method: 'CASH' }, { type: 'COLLECTION', amount: 1, method: 'CARD' }, { type: 'REFUND', amount: 1, method: 'CASH' }, { type: 'ADJUST', amount: 1, method: 'CASH' }]) {
    assert.throws(() => module.parseTransaction(value));
  }
});

test('TS03 scenario loader validates path, arrays and explicit extra-field policy', () => {
  const scenario = module.parseScenario({ role: 'STAFF', orderCode: 'LD-001', expectedStatus: 'RECEIVED', expectedVisibleActions: [] });
  assert.equal(module.scenarioTitle(scenario), 'STAFF sees LD-001 as RECEIVED');
  assert.throws(() => module.parseScenario({ ...scenario, expectedVisibleActions: [1] }), /expectedVisibleActions/);
  assert.throws(() => module.parseScenario({ ...scenario, secret: true }), /scenario.secret/);
  assert.throws(() => module.parseScenario({ ...scenario, expectedStatus: 'READY' }), /expectedStatus/);
});
