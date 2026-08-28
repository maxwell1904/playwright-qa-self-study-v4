export const serviceCode = 'UI_QUAN_AO';
export const serviceName = 'Ủi quần áo';
export const pricingUnit = 'ITEM';
export const unitPrice = 12000;
export const quantity = 3;
export const lineAmount = unitPrice * quantity;
export const active = true;

console.log(`${serviceCode} | ${serviceName}`);
console.log(`Unit: ${pricingUnit}`);
console.log(`Line amount: ${lineAmount} VND`);
console.log(`Quantity type: ${typeof quantity}`);
