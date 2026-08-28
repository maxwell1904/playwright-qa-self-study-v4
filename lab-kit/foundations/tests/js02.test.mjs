import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { lessonUrl } from './_target.mjs';

const result = spawnSync(process.execPath, [fileURLToPath(lessonUrl('js02'))], {
  encoding: 'utf8'
});

if (result.error) throw result.error;

const lines = result.stdout.trim().split(/\r?\n/);

test('JS02 role matrix distinguishes login, forbidden and manager access', () => {
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(lines.slice(0, 3), [
    'ANONYMOUS: 302 login',
    'STAFF: 403',
    'MANAGER: 200',
  ]);
});

test('JS02 lifecycle covers five statuses and rejects unknown', () => {
  assert.deepEqual(lines.slice(3), [
    'RECEIVED: start or cancel',
    'PROCESSING: mark ready',
    'READY_FOR_PICKUP: complete when guards pass',
    'COMPLETED: terminal',
    'CANCELLED: terminal',
    'UNKNOWN: ERROR unknown status',
  ]);
});
