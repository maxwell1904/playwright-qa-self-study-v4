type Scenario = { code: string; expectedStatus: 'RECEIVED' | 'PROCESSING' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseScenario(value: unknown): Scenario {
  if (!isRecord(value)) throw new Error('scenario must be an object');
  if (typeof value.code !== 'string' || value.code.length === 0) throw new Error('code is required');
  if (value.expectedStatus !== 'RECEIVED' && value.expectedStatus !== 'PROCESSING') {
    throw new Error('expectedStatus is invalid');
  }
  return { code: value.code, expectedStatus: value.expectedStatus };
}

const external: unknown = JSON.parse('{"code":"LD-001","expectedStatus":"RECEIVED"}');
console.log(parseScenario(external));
