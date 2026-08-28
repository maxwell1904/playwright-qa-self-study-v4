import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { target } from './_target.mjs';

test('JS07 learner-owned tests are executable and must prove the provided contracts', () => {
  const file = fileURLToPath(new URL(`../${target}/js07.learner.test.mjs`, import.meta.url));
  const source = readFileSync(file, 'utf8');
  const registeredTests = source.match(/\btest\s*\(/g) ?? [];
  assert.ok(registeredTests.length >= 4, 'Write at least four explicit behavior tests');
  assert.doesNotMatch(source, /assert\.fail\s*\(/, 'Remove placeholder assert.fail calls');
});
