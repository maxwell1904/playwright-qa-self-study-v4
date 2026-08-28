import { readFileSync } from 'node:fs';
import { normalizePhone } from './src/phone.mjs';
import { deriveLedger } from './src/ledger.mjs';
import { findOrderByCode } from './src/orders.mjs';

const raw = readFileSync(new URL('./data/scenario.json', import.meta.url), 'utf8');
const scenario = JSON.parse(raw);
const order = findOrderByCode(scenario.orders, scenario.targetOrderCode);
const phone = normalizePhone(order.phone);
const ledger = deriveLedger(order.transactions);
console.log(`${order.code} | ${phone} | net paid ${ledger.netPaid} VND`);
