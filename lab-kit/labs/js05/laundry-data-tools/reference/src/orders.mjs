export function findOrderByCode(orders, code) {
  const order = orders.find(candidate => candidate.code === code);
  if (!order) throw new Error(`Order not found: ${code}`);
  return order;
}
