console.log('Write every prediction before running this file.');

console.log('\nA1');
console.log(1);
Promise.resolve().then(() => console.log(2));
console.log(3);

await new Promise(resolve => setTimeout(resolve, 10));

console.log('\nA2');
async function f() {
  console.log('f1');
  await 0;
  console.log('f2');
}
console.log('a');
f();
console.log('b');

await new Promise(resolve => setTimeout(resolve, 10));

console.log('\nA3');
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('micro'));
console.log('sync');

await new Promise(resolve => setTimeout(resolve, 10));

console.log('\nA4 - error propagation');
async function rejects() {
  throw new Error('boom');
}
async function caught() {
  try {
    await rejects();
  } catch (error) {
    console.log('caught:', error.message);
  }
}
await caught();

console.log('\nA5 - independent work');
const slowValue = label => new Promise(resolve => setTimeout(() => resolve(label), 20));
const [catalog, settings] = await Promise.all([
  slowValue('catalog'),
  slowValue('settings'),
]);
console.log(catalog, settings);
