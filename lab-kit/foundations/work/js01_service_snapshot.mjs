// JS01 independent task. Keep separate bindings; do not replace them with one copied output string.
export const serviceCode = 'TODO_CODE'; // TODO choose a service code
export const serviceName = 'TODO_NAME'; // TODO choose a Vietnamese service name
export const pricingUnit = 'KG'; // TODO keep KG or change to ITEM
export const unitPrice = 12000; // TODO choose a number
export const quantity = 3; // TODO choose a number
export const lineAmount = -1; // TODO derive from unitPrice and quantity
export const active = false; // TODO choose the intended boolean

console.log(`${serviceCode} | ${serviceName}`);
console.log(`Unit: ${pricingUnit}`);
console.log(`Line amount: ${lineAmount} VND`);
console.log(`Quantity type: ${typeof quantity}`);
