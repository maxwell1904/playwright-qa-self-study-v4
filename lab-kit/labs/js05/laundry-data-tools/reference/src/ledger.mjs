export function deriveLedger(transactions) {
  const result = transactions.reduce((ledger, transaction) => {
    if (transaction.type === 'COLLECTION') ledger.collected += transaction.amount;
    else if (transaction.type === 'REFUND') ledger.refunded += transaction.amount;
    else throw new Error(`Unknown transaction type: ${transaction.type}`);
    return ledger;
  }, { collected: 0, refunded: 0 });
  return { ...result, netPaid: result.collected - result.refunded };
}
