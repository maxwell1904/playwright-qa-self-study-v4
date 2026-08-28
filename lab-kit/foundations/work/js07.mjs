// Production functions are provided in JS07. The learner's work is the adjacent test file.
export function normalizeStoredPhone(input) {
  if (typeof input !== 'string') throw new Error('Phone must be text');
  let normalized = input.trim().replaceAll(/[ .-]/g, '');
  if (normalized.startsWith('+84')) normalized = `0${normalized.slice(3)}`;
  if (!/^0\d{9}$/.test(normalized)) throw new Error('Phone must be 10 digits beginning with 0');
  return normalized;
}

export function deriveBalance(orderTotal, transactions) {
  let collected = 0;
  let refunded = 0;
  for (const transaction of transactions) {
    if (transaction.type === 'COLLECTION') collected += transaction.amount;
    else if (transaction.type === 'REFUND') refunded += transaction.amount;
    else throw new Error(`Unknown transaction type: ${transaction.type}`);
  }
  const netPaid = collected - refunded;
  return { collected, refunded, netPaid, remaining: Math.max(orderTotal - netPaid, 0) };
}
