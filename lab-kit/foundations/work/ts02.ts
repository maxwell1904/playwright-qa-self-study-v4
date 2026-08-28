export type Role = string; // TODO narrow to STAFF | MANAGER.
export type OrderStatus = string; // TODO narrow to five canonical statuses.
export type IssueStatus = string; // TODO narrow to OPEN | RESOLVED.
export type PaymentMethod = string; // TODO narrow to the two canonical methods.

export type PaymentTransaction =
  | { readonly code: string; type: 'COLLECTION'; amount: number; method: PaymentMethod }
  | { readonly code: string; type: 'REFUND'; amount: number; method: PaymentMethod; reason: string };

export function transactionLabel(_transaction: PaymentTransaction): string {
  return 'TODO';
}

export function signedAmount(_transaction: PaymentTransaction): number {
  return 0;
}

export type Issue = { status: IssueStatus };
export type PickupReason = 'WRONG_STATUS' | 'BALANCE_REMAINS' | 'OPEN_ISSUE';
export type PickupDecision = { allowed: true } | { allowed: false; reason: PickupReason };

export function decidePickup(_input: {
  role: Role;
  status: OrderStatus;
  remainingAmount: number;
  issues: readonly Issue[];
  note?: string;
}): PickupDecision {
  return { allowed: false, reason: 'WRONG_STATUS' };
}
