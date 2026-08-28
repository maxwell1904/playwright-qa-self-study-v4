import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonUrl, target } from './_target.mjs';

const main = await import(lessonUrl('js05'));
const phone = await import(new URL(`../${target}/js05-phone.mjs`, import.meta.url));
const status = await import(new URL(`../${target}/js05-status.mjs`, import.meta.url));
const orders = await import(new URL(`../${target}/js05-orders.mjs`, import.meta.url));

test('JS05 named modules compose into the main JSON summary', () => {
  assert.equal(main.buildSummary('LD-001'), 'LD-001 | 0912345678 | Đã tiếp nhận');
});

test('JS05 helpers expose invalid domain data instead of hiding it', () => {
  assert.equal(phone.normalizePhone('0987.654.321'), '0987654321');
  assert.throws(() => phone.normalizePhone('abc'), /phone/i);
  assert.throws(() => status.statusLabel('READY'), /READY/);
  assert.throws(() => orders.findOrderByCode([], 'LD-X'), /LD-X/);
});

test('JS05 JSON parse success is not the same as domain validation', () => {
  const parsed = JSON.parse('{"code":"LD-X"}');
  assert.equal(parsed.code, 'LD-X');
  assert.throws(() => phone.normalizePhone(parsed.phone), /phone/i);
});
