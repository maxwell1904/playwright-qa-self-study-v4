function requirePositiveFinite(name, value) {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be positive`);
}

export function lineAmount(unitPrice, quantity) {
  requirePositiveFinite('unitPrice', unitPrice);
  requirePositiveFinite('quantity', quantity);
  return unitPrice * quantity;
}

export function remainingAmount(orderTotal, collectedAmount, refundedAmount) {
  if (!Number.isFinite(orderTotal) || orderTotal < 0) throw new Error('orderTotal must be non-negative');
  if (!Number.isFinite(collectedAmount) || collectedAmount < 0) throw new Error('collectedAmount must be non-negative');
  if (!Number.isFinite(refundedAmount) || refundedAmount < 0) throw new Error('refundedAmount must be non-negative');
  const netPaid = collectedAmount - refundedAmount;
  return Math.max(orderTotal - netPaid, 0);
}

export function statusLabel(status) {
  if (status === 'RECEIVED') return 'Đã tiếp nhận';
  if (status === 'PROCESSING') return 'Đang xử lý';
  if (status === 'READY_FOR_PICKUP') return 'Sẵn sàng trả';
  if (status === 'COMPLETED') return 'Đã hoàn tất';
  if (status === 'CANCELLED') return 'Đã hủy';
  throw new Error(`Unknown order status: ${status}`);
}

export function canCompletePickup(status, remaining, hasOpenIssue) {
  return status === 'READY_FOR_PICKUP' && remaining === 0 && hasOpenIssue === false;
}
