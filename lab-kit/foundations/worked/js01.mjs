const rawQuantity = '2';
const unitPrice = 25000;
const quantity = Number(rawQuantity);
const quantityIsFinite = Number.isFinite(quantity);
const quantityIsPositive = quantity > 0;
const lineAmount = unitPrice * quantity;

console.log('rawQuantity:', rawQuantity);
console.log('raw type:', typeof rawQuantity);
console.log('quantity:', quantity);
console.log('quantity is finite:', quantityIsFinite);
console.log('quantity is positive:', quantityIsPositive);
console.log('line amount:', lineAmount);
console.log(`Prediction check: '2' + 1 = ${'2' + 1}; Number('2') + 1 = ${Number('2') + 1}`);
