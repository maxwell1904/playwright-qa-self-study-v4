import test from 'node:test';
import assert from 'node:assert/strict';
import { canCollect } from './collection.mjs';

test('collection follows active/positive/remaining guards', () => {
  assert.equal(canCollect({ active: true, amount: 1, remaining: 1 }), true);
  assert.equal(canCollect({ active: true, amount: 0, remaining: 1 }), false);
  assert.equal(canCollect({ active: false, amount: 1, remaining: 1 }), false);
});
