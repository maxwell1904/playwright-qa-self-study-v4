import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonUrl } from './_target.mjs';

const module = await import(lessonUrl('ts01', 'ts').href);

const services = [
  { code: 'S1', name: 'Giặt sấy', unitPrice: 25000, active: true },
  { code: 'S2', name: 'Dịch vụ cũ', unitPrice: 10000, active: false },
];

test('TS01 completion preserves strict service shapes and honest find', () => {
  assert.deepEqual(module.activeServices(services).map((service: { code: string }) => service.code), ['S1']);
  assert.equal(module.findService(services, 'S1')?.name, 'Giặt sấy');
  assert.equal(module.findService(services, 'S-X'), undefined);
  assert.equal(module.displayPrice(services[0]!), 'Giặt sấy: 25000 VND');
});

test('TS01 independent order helpers derive values and expose missing identity', () => {
  const items = [{ serviceCode: 'S1', serviceName: 'Giặt sấy', unitPrice: 25000, quantity: 2 }];
  const order = { code: 'LD-001', customer: { name: 'Nguyễn An', phone: '0912345678' }, items };
  assert.equal(module.orderTotal(items), 50000);
  assert.equal(module.findItem(items, 'S1')?.serviceName, 'Giặt sấy');
  assert.equal(module.findItem(items, 'S-X'), undefined);
  assert.equal(module.requireItem(items, 'S1').quantity, 2);
  assert.throws(() => module.requireItem(items, 'S-X'), /S-X/);
  assert.equal(module.orderSummary(order), 'LD-001 | Nguyễn An | 50000 VND');
});
