export const orders = [
  { code: 'LD-001', status: 'RECEIVED', total: 75000 },
  { code: 'LD-002', status: 'PROCESSING', total: 120000 },
  { code: 'LD-003', status: 'READY_FOR_PICKUP', total: 80000 },
  { code: 'LD-004', status: 'RECEIVED', total: 50000 },
];

export const targetOrder = orders.find(order => order.code === 'LD-003');
export const receivedOrders = orders.filter(order => order.status === 'RECEIVED');
export const codes = orders.map(order => order.code);
export const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
export const allHaveCodes = orders.every(order => order.code.length > 0);

export function findOrderByCode(orderList, code) {
  const order = orderList.find(candidate => candidate.code === code);
  if (!order) throw new Error(`Order not found: ${code}`);
  return order;
}

export function activeOrderCodes(orderList) {
  return orderList
    .filter(order => order.status !== 'COMPLETED' && order.status !== 'CANCELLED')
    .map(order => order.code);
}

export function hasOpenIssue(order) {
  if (order.issues === undefined) return false;
  return order.issues.some(issue => issue.status === 'OPEN');
}

export function deriveLedger(transactions) {
  return transactions.reduce((ledger, transaction) => {
    if (transaction.type === 'COLLECTION') ledger.collected += transaction.amount;
    else if (transaction.type === 'REFUND') ledger.refunded += transaction.amount;
    else throw new Error(`Unknown transaction type: ${transaction.type}`);
    ledger.netPaid = ledger.collected - ledger.refunded;
    return ledger;
  }, { collected: 0, refunded: 0, netPaid: 0 });
}

export function snapshotSummary(order) {
  return {
    code: order.code,
    status: order.status,
    customer: { ...order.customer },
    itemCount: order.items.length,
    serviceCodes: order.items.map(item => item.serviceCode),
  };
}
