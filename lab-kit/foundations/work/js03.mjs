export function lineAmount(unitPrice, quantity) {
  // TODO reject non-positive finite inputs, then multiply.
  return undefined;
}

export function remainingAmount(orderTotal, collectedAmount, refundedAmount) {
  // TODO net paid = collected - refunded; remaining cannot be below zero.
  return undefined;
}

export function statusLabel(status) {
  // TODO support exactly the five canonical order statuses and throw for unknown.
  return 'TODO';
}

export function canCompletePickup(status, remaining, hasOpenIssue) {
  // TODO all three guards must pass.
  return false;
}
