export async function buildOrderDetail(code, dependencies) {
  const order = await dependencies.fetchOrder(code);
  const [transactions, customer] = await Promise.all([
    dependencies.fetchTransactions(code),
    dependencies.fetchCustomer(order.customerId),
  ]);
  return { order, transactions, customer };
}

export async function recordCollection(orderCode, amount, dependencies) {
  const order = await dependencies.fetchOrder(orderCode);
  const transactions = await dependencies.fetchTransactions(orderCode);
  const collected = transactions
    .filter(transaction => transaction.type === 'COLLECTION')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const refunded = transactions
    .filter(transaction => transaction.type === 'REFUND')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const remaining = Math.max(order.total - (collected - refunded), 0);
  if (!['RECEIVED', 'PROCESSING', 'READY_FOR_PICKUP'].includes(order.status)) {
    throw new Error(`Collection not allowed for ${order.status}`);
  }
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Collection amount must be positive');
  if (amount > remaining) throw new Error(`Collection exceeds remaining ${remaining}`);
  const transaction = await dependencies.saveTransaction({ orderCode, type: 'COLLECTION', amount });
  return dependencies.buildReceipt(order, transaction);
}
