import { statusLabel } from './js05-status.mjs';

const raw = '{"code":"LD-001","status":"RECEIVED"}';
const value = JSON.parse(raw);

if (typeof value.code !== 'string' || typeof value.status !== 'string') {
  throw new Error('Scenario fields are missing');
}

console.log(`${value.code} | ${statusLabel(value.status)}`);
console.log('JSON parse succeeded, then a separate domain check ran.');
