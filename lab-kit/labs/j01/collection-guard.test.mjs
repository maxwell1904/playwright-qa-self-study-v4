import test from 'node:test';
import assert from 'node:assert/strict';
import { canCollect, canMarkReady } from './collection-guard.mjs';

test('J01 collection boundaries reject zero and over-remaining', () => {
  assert.equal(canCollect({ status: 'RECEIVED', amount: 0, remaining: 100 }), false);
  assert.equal(canCollect({ status: 'RECEIVED', amount: 1, remaining: 100 }), true);
  assert.equal(canCollect({ status: 'READY_FOR_PICKUP', amount: 100, remaining: 100 }), true);
  assert.equal(canCollect({ status: 'READY_FOR_PICKUP', amount: 101, remaining: 100 }), false);
  assert.equal(canCollect({ status: 'COMPLETED', amount: 1, remaining: 100 }), false);
});

test('J01 an open issue blocks the ready transition', () => {
  assert.equal(canMarkReady({ status: 'PROCESSING', hasOpenIssue: false }), true);
  assert.equal(canMarkReady({ status: 'PROCESSING', hasOpenIssue: true }), false);
});
