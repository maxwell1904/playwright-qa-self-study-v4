export type Role = 'STAFF' | 'MANAGER';
export type OrderStatus = 'RECEIVED' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';
export type IssueStatus = 'OPEN' | 'RESOLVED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER_MANUAL';

export type PaymentTransaction =
  | { readonly code: string; type: 'COLLECTION'; amount: number; method: PaymentMethod }
  | { readonly code: string; type: 'REFUND'; amount: number; method: PaymentMethod; reason: string };

export function transactionLabel(transaction: PaymentTransaction): string {
  return transaction.type === 'COLLECTION' ? 'Thu tiền' : `Hoàn tiền: ${transaction.reason}`;
}

export function signedAmount(transaction: PaymentTransaction): number {
  return transaction.type === 'COLLECTION' ? transaction.amount : -transaction.amount;
}

export type Issue = { status: IssueStatus };
export type PickupReason = 'WRONG_STATUS' | 'BALANCE_REMAINS' | 'OPEN_ISSUE';
export type PickupDecision = { allowed: true } | { allowed: false; reason: PickupReason };

export function decidePickup(input: {
  role: Role;
  status: OrderStatus;
  remainingAmount: number;
  issues: readonly Issue[];
  note?: string;
}): PickupDecision {
  if (input.status !== 'READY_FOR_PICKUP') return { allowed: false, reason: 'WRONG_STATUS' };
  if (input.remainingAmount !== 0) return { allowed: false, reason: 'BALANCE_REMAINS' };
  if (input.issues.some(issue => issue.status === 'OPEN')) return { allowed: false, reason: 'OPEN_ISSUE' };
  return { allowed: true };
}
