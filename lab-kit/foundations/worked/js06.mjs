const delay = (milliseconds, value) => new Promise(resolve =>
  setTimeout(() => resolve(value), milliseconds)
);

async function loadDetail() {
  const order = await delay(5, { code: 'LD-001', customerId: 7 });
  const [customer, transactions] = await Promise.all([
    delay(5, { id: order.customerId, name: 'Nguyễn An' }),
    delay(5, [{ type: 'COLLECTION', amount: 25000 }])
  ]);
  return { order, customer, transactions };
}

console.log(await loadDetail());
console.log('Order is a prerequisite; customer and transactions are independent afterwards.');
