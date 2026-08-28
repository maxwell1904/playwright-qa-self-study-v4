export const receiptLines = [
  'Order code: LD-001',
  'Customer: Nguyễn An',
  'Status: Đã tiếp nhận',
];

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const line of receiptLines) console.log(line);
}
