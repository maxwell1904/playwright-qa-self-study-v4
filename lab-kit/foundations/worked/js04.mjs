const transactions = [
  { code: 'TX-001', type: 'COLLECTION', amount: 70000 },
  { code: 'TX-002', type: 'COLLECTION', amount: 50000 },
  { code: 'TX-003', type: 'REFUND', amount: 20000 }
];

const ledger = transactions.reduce(
  (result, transaction) => {
    if (transaction.type === 'COLLECTION') result.collected += transaction.amount;
    if (transaction.type === 'REFUND') result.refunded += transaction.amount;
    return result;
  },
  { collected: 0, refunded: 0 }
);

console.log({ ...ledger, netPaid: ledger.collected - ledger.refunded });
console.log('Business identity:', transactions.find(transaction => transaction.code === 'TX-002'));
