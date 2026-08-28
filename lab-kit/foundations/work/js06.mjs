export async function buildOrderDetail(code, dependencies) {
  // TODO fetch order first, then start independent customer + transactions reads together.
  // Let a missing-order error propagate with its business code.
  void code;
  void dependencies;
  return undefined;
}

export async function recordCollection(orderCode, amount, dependencies) {
  // TODO load order -> load transactions -> derive remaining -> validate -> save -> receipt.
  // saveTransaction must never run when a guard fails.
  void orderCode;
  void amount;
  void dependencies;
  return undefined;
}
