export const lessons = [
  { id: 'QA00', extension: 'mjs', outcome: 'runtime, command and failure-layer orientation' },
  { id: 'JS01', extension: 'mjs', companions: ['js01_service_snapshot.mjs'], outcome: 'values, variables, conversion and expressions' },
  { id: 'JS02', extension: 'mjs', outcome: 'conditions, decisions and exhaustive unknown handling' },
  { id: 'JS03', extension: 'mjs', outcome: 'function contracts, return, scope and callbacks' },
  { id: 'JS04', extension: 'mjs', outcome: 'arrays, objects, reference ownership and business identity' },
  { id: 'JS05', extension: 'mjs', companions: ['js05-monolith.mjs', 'js05-phone.mjs', 'js05-status.mjs', 'js05-orders.mjs'], outcome: 'modules, JSON, errors and meaningful stack evidence' },
  { id: 'JS06', extension: 'mjs', outcome: 'Promise dependency, await and error propagation' },
  { id: 'JS07', extension: 'mjs', companions: ['js07.learner.test.mjs'], outcome: 'test oracle, boundaries and mutation detection' },
  { id: 'JS08', extension: 'mjs', outcome: 'Playwright spec anatomy and awaited-step planning' },
  { id: 'TS01', extension: 'ts', outcome: 'strict inference, object/function types and honest undefined' },
  { id: 'TS02', extension: 'ts', outcome: 'literal unions, discriminated unions and exhaustive decisions' },
  { id: 'TS03', extension: 'ts', outcome: 'unknown boundary validation and narrowing' },
  { id: 'TS04', extension: 'ts', outcome: 'typed Playwright scenario and Promise-safe helper' }
];

export function findLesson(rawId) {
  const id = rawId.toUpperCase();
  const lesson = lessons.find(candidate => candidate.id === id);
  if (!lesson) {
    throw new Error(`Unknown foundation lesson: ${rawId}`);
  }
  return lesson;
}
