export type PaymentMethod = 'CASH' | 'BANK_TRANSFER_MANUAL';
export type PaymentTransaction =
  | { type: 'COLLECTION'; amount: number; method: PaymentMethod }
  | { type: 'REFUND'; amount: number; method: PaymentMethod; reason: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === 'CASH' || value === 'BANK_TRANSFER_MANUAL';
}

export function parseTransaction(value: unknown): PaymentTransaction {
  if (!isRecord(value)) throw new Error('transaction must be an object');
  if (typeof value.amount !== 'number' || !Number.isFinite(value.amount) || value.amount <= 0) {
    throw new Error('transaction.amount must be a positive finite number');
  }
  if (!isPaymentMethod(value.method)) throw new Error('transaction.method is invalid');
  if (value.type === 'COLLECTION') return { type: value.type, amount: value.amount, method: value.method };
  if (value.type === 'REFUND') {
    if (typeof value.reason !== 'string' || value.reason.trim() === '') throw new Error('transaction.reason is required');
    return { type: value.type, amount: value.amount, method: value.method, reason: value.reason };
  }
  throw new Error('transaction.type is invalid');
}

export type Scenario = {
  role: 'STAFF' | 'MANAGER';
  orderCode: string;
  expectedStatus: 'RECEIVED' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';
  expectedVisibleActions: string[];
};

function isOrderStatus(value: unknown): value is Scenario['expectedStatus'] {
  return value === 'RECEIVED'
    || value === 'PROCESSING'
    || value === 'READY_FOR_PICKUP'
    || value === 'COMPLETED'
    || value === 'CANCELLED';
}

export function parseScenario(value: unknown): Scenario {
  if (!isRecord(value)) throw new Error('scenario must be an object');
  const allowedFields: string[] = ['role', 'orderCode', 'expectedStatus', 'expectedVisibleActions'];
  const extra = Object.keys(value).find(key => !allowedFields.includes(key));
  if (extra) throw new Error(`scenario.${extra} is not allowed`);
  if (value.role !== 'STAFF' && value.role !== 'MANAGER') throw new Error('scenario.role is invalid');
  if (typeof value.orderCode !== 'string' || value.orderCode.trim() === '') throw new Error('scenario.orderCode is required');
  if (!isOrderStatus(value.expectedStatus)) throw new Error('scenario.expectedStatus is invalid');
  if (!Array.isArray(value.expectedVisibleActions) || !value.expectedVisibleActions.every(item => typeof item === 'string')) {
    throw new Error('scenario.expectedVisibleActions must contain only strings');
  }
  return {
    role: value.role,
    orderCode: value.orderCode,
    expectedStatus: value.expectedStatus,
    expectedVisibleActions: value.expectedVisibleActions,
  };
}

export function scenarioTitle(scenario: Scenario): string {
  return `${scenario.role} sees ${scenario.orderCode} as ${scenario.expectedStatus}`;
}
