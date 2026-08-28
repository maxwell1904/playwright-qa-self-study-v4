import assert from 'node:assert/strict';

function deriveRemaining(total, collected, refunded) {
  return Math.max(total - (collected - refunded), 0);
}

const actual = deriveRemaining(100000, 70000, 10000);
assert.equal(actual, 40000, 'requirement-derived oracle');
assert.equal(deriveRemaining(100000, 110000, 0), 0, 'remaining is clamped at zero');
console.log('Two independent oracles passed. Change subtraction to addition to test mutation strength.');
