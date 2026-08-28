// JS05 starting point: this intentionally mixes pure helpers, filesystem and main flow.
// First run it. Then move each helper into the pre-created js05-*.mjs target modules and
// keep js05.mjs as the composition root. Do not duplicate helpers to make imports disappear.
import { readFileSync } from 'node:fs';

function normalizePhone(phone) {
  let normalized = phone.trim().replaceAll(/[ .-]/g, '');
  if (normalized.startsWith('+84')) normalized = `0${normalized.slice(3)}`;
  if (!/^0\d{9}$/.test(normalized)) throw new Error(`Invalid stored phone: ${phone}`);
  return normalized;
}

function statusLabel(status) {
  const labels = {
    RECEIVED: 'Đã tiếp nhận',
    PROCESSING: 'Đang xử lý',
    READY_FOR_PICKUP: 'Sẵn sàng trả',
    COMPLETED: 'Đã hoàn tất',
    CANCELLED: 'Đã hủy',
  };
  if (!(status in labels)) throw new Error(`Unknown order status: ${status}`);
  return labels[status];
}

function findOrderByCode(orders, code) {
  const order = orders.find(candidate => candidate.code === code);
  if (!order) throw new Error(`Order not found: ${code}`);
  return order;
}

const raw = readFileSync(new URL('../fixtures/js05-orders.json', import.meta.url), 'utf8');
const orders = JSON.parse(raw);
const code = process.argv[2] ?? 'LD-001';
const order = findOrderByCode(orders, code);
console.log(`${order.code} | ${normalizePhone(order.phone)} | ${statusLabel(order.status)}`);
