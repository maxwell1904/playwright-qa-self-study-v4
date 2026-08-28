import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const compose = await readFile(new URL('./compose.yaml', import.meta.url), 'utf8');
for (const token of ['postgres:17', '55432', '5432', 'laundry_lab_pgdata', 'healthcheck', 'pg_isready', 'schema.sql', 'seed.sql']) {
  assert.ok(compose.includes(token), `Compose contract missing: ${token}`);
}
console.log('PASS: J06 Compose topology contract is present');
