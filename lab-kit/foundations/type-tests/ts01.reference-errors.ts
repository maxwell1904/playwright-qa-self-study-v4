import type { Order, Service } from '../reference/ts01.ts';

// These lines must remain errors. @ts-expect-error makes the negative contract executable.
// @ts-expect-error unitPrice must be a number
const wrongPrice: Service = { code: 'S1', name: 'X', unitPrice: '25000', active: true };
// @ts-expect-error customer is required
const missingCustomer: Order = { code: 'LD-001', items: [] };
// @ts-expect-error phone is required in the snapshot
const missingPhone: Order = { code: 'LD-001', customer: { name: 'A' }, items: [] };

void wrongPrice;
void missingCustomer;
void missingPhone;
