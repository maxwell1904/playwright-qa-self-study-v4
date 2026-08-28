// JS01 deliberate-failure playground.
// Predict first. Keep only one failure active, record evidence, then restore it.
// Do not add if/function/return/throw; those belong to later lessons.

// Failure A is active first: observe implicit string concatenation and explicit conversion.
const quantityFromInput = '2';
const nextQuantity = quantityFromInput + 1;
const convertedQuantity = Number(quantityFromInput);
const isFiniteNumber = Number.isFinite(convertedQuantity);
const isPositive = convertedQuantity > 0;

console.log(nextQuantity);
console.log(convertedQuantity);
console.log(isFiniteNumber);
console.log(isPositive);

// Variation A: change only quantityFromInput to 'abc', predict all four lines, then restore '2'.

// Failure B: comment Failure A, uncomment these two lines, predict the first meaningful error.
// const status = 'RECEIVED';
// status = 'PROCESSING';

// Failure C: restore B, uncomment these lines, then identify the misspelled binding.
// const serviceName = 'Giặt sấy quần áo';
// console.log(servceName);
