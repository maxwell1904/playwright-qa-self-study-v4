const orderCode = 'LD-20260813-000123';
const customerName = 'Trần Thu Hà';
const collectedAmount = 50000;
const orderTotal = 120000;

export const remainingAmount = orderTotal - collectedAmount;
export const fullyPaid = remainingAmount === 0;
export const label = `${orderCode} | ${customerName} | remaining ${remainingAmount} VND`;

console.log(remainingAmount);
console.log(fullyPaid);
console.log(label);

export { orderCode, customerName, collectedAmount, orderTotal };
