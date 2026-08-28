import { readFileSync } from 'node:fs';
import { normalizePhone } from './js05-phone.mjs';
import { statusLabel } from './js05-status.mjs';
import { findOrderByCode } from './js05-orders.mjs';

export function buildSummary(code) {
  const raw = readFileSync(new URL('../fixtures/js05-orders.json', import.meta.url), 'utf8');
  const orders = JSON.parse(raw);
  const order = findOrderByCode(orders, code);
  return `${order.code} | ${normalizePhone(order.phone)} | ${statusLabel(order.status)}`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // Keep the rejection visible to Node/CI; do not catch and exit 0 with only "failed".
  console.log(buildSummary(process.argv[2] ?? 'LD-001'));
}
