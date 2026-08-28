export function canCollect({ status, amount, remaining }) {
  const eligible = ['RECEIVED', 'PROCESSING', 'READY_FOR_PICKUP'].includes(status);
  return eligible && Number.isFinite(amount) && amount > 0 && amount <= remaining;
}

export function canMarkReady({ status, hasOpenIssue }) {
  return status === 'PROCESSING' && hasOpenIssue === false;
}
