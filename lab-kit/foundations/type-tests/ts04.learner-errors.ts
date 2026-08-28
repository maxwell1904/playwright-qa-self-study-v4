import type { OrderScenario } from '../work/ts04.ts';

// TS04 learner type-test workspace.
// After predicting each compiler message, add:
// 1. one OrderScenario with a status outside the literal union;
// 2. one OrderScenario missing expectedCustomer.
// Put `// @ts-expect-error -- <your reason>` directly above each intentional error,
// then run `npm run foundation:typecheck`. Do not use `any`, a cast or @ts-ignore.

export type LearnerScenario = OrderScenario;
