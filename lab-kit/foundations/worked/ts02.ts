type Transaction =
  | { type: 'COLLECTION'; amount: number }
  | { type: 'REFUND'; amount: number; reason: string };

function transactionLabel(transaction: Transaction): string {
  if (transaction.type === 'COLLECTION') return `Thu ${transaction.amount}`;
  return `Hoàn ${transaction.amount}: ${transaction.reason}`;
}

const transactions: Transaction[] = [
  { type: 'COLLECTION', amount: 50000 },
  { type: 'REFUND', amount: 10000, reason: 'Thu thừa' }
];

console.log(transactions.map(transactionLabel));
