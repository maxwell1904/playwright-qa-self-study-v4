export function canCollect({ active, amount, remaining }) {
  return active && amount > 0 && amount <= remaining;
}
