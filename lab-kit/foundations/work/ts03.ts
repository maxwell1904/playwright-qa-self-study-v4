export type PaymentMethod = 'CASH' | 'BANK_TRANSFER_MANUAL';
export type PaymentTransaction =
  | { type: 'COLLECTION'; amount: number; method: PaymentMethod }
  | { type: 'REFUND'; amount: number; method: PaymentMethod; reason: string };

export function parseTransaction(_value: unknown): PaymentTransaction {
  // TODO object guard, positive finite amount, method, discriminant and refund reason.
  throw new Error('TODO parse external transaction');
}

export type Scenario = {
  role: 'STAFF' | 'MANAGER';
  orderCode: string;
  expectedStatus: 'RECEIVED' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';
  expectedVisibleActions: string[];
};

export function parseScenario(_value: unknown): Scenario {
  // TODO reject unknown extra fields and include a field path in each error.
  throw new Error('TODO parse scenario');
}

export function scenarioTitle(scenario: Scenario): string {
  return `${scenario.role} sees ${scenario.orderCode} as ${scenario.expectedStatus}`;
}
