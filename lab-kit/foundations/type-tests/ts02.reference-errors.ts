import type { OrderStatus, PaymentTransaction, Role } from '../reference/ts02.ts';

// @ts-expect-error role is a closed union
const anonymous: Role = 'ANONYMOUS';
// @ts-expect-error READY is not a canonical order status
const ready: OrderStatus = 'READY';
// @ts-expect-error REFUND requires a reason
const refund: PaymentTransaction = { code: 'TX-1', type: 'REFUND', amount: 1, method: 'CASH' };

void anonymous;
void ready;
void refund;
