import type { OrderScenario } from '../reference/ts04.ts';

// @ts-expect-error READY is outside the scenario's supported typed status set
const wrongStatus: OrderScenario = { code: 'LD-1', expectedCustomer: 'A', expectedStatus: 'READY' };
// @ts-expect-error expectedCustomer is required
const missingCustomer: OrderScenario = { code: 'LD-1', expectedStatus: 'PROCESSING' };

void wrongStatus;
void missingCustomer;
