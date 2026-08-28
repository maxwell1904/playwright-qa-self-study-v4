export const orders = [
  { code: 'LD-001', status: 'RECEIVED', total: 75000 },
  { code: 'LD-002', status: 'PROCESSING', total: 120000 },
  { code: 'LD-003', status: 'READY_FOR_PICKUP', total: 80000 },
  { code: 'LD-004', status: 'RECEIVED', total: 50000 },
];

export const targetOrder = undefined; // TODO use find by business identity.
export const receivedOrders = []; // TODO use filter.
export const codes = []; // TODO use map.
export const totalValue = 0; // TODO use reduce.
export const allHaveCodes = false; // TODO use every.

export function findOrderByCode(orderList, code) {
  // TODO return an explicit result or throw when missing.
  return orderList[0];
}

export function activeOrderCodes(orderList) {
  // TODO exclude COMPLETED and CANCELLED without depending on index.
  return [];
}

export function hasOpenIssue(order) {
  // TODO inspect order.issues; do not mutate it.
  return false;
}

export function deriveLedger(transactions) {
  // TODO return { collected, refunded, netPaid } and reject unknown transaction types.
  return { collected: 0, refunded: 0, netPaid: 0 };
}

export function snapshotSummary(order) {
  // TODO return a new object containing business identity and snapshot-safe summary fields.
  return order;
}
