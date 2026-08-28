import type { OrderStatus, PaymentTransaction } from '../work/ts02.ts';

// TS02 learner type-test workspace.
// Predict first, then add three intentional errors:
// 1. an OrderStatus outside the literal union;
// 2. a REFUND transaction without reason;
// 3. an assignment to readonly transaction.code.
// Put `// @ts-expect-error -- <your reason>` directly above each error and run
// `npm run foundation:typecheck`. Do not use any, a cast or @ts-ignore.

export type LearnerOrderStatus = OrderStatus;
export type LearnerPaymentTransaction = PaymentTransaction;
