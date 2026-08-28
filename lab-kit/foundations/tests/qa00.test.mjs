import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { lessonUrl } from './_target.mjs';

const expected = [
  'Order code: LD-001',
  'Customer: Nguyễn An',
  'Status: Đã tiếp nhận',
];

test('QA00 receipt has the exact observable output', async () => {
  const module = await import(lessonUrl('qa00'));
  assert.deepEqual(module.receiptLines, expected);
});

test('QA00 starter runs as a real Node command and exits cleanly', () => {
  const result = spawnSync(process.execPath, [fileURLToPath(lessonUrl('qa00'))], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trimEnd(), expected.join('\n'));
});
