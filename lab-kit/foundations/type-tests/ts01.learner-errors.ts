import type { OrderItem, Service } from '../work/ts01.ts';
import { displayPrice, findItem, findService } from '../work/ts01.ts';

const services: Service[] = [];
const items: OrderItem[] = [];

// TS01 independent type-test workspace.
// 1. Predict the compiler message before editing.
// 2. Add one invalid call below each TODO.
// 3. Put `// @ts-expect-error -- <your reason>` immediately above that call.
// 4. Run `npm run foundation:typecheck`.
// A green command now means TypeScript found each expected error. If an invalid call
// becomes valid, TypeScript reports an unused @ts-expect-error directive.

// TODO A: call findService with a non-string code.
void findService;
void services;

// TODO B: pass a value that is not a Service to displayPrice.
void displayPrice;

// TODO C: call findItem with a non-string service code.
void findItem;
void items;
