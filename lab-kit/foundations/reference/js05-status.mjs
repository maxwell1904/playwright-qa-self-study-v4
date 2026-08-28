const labels = {
  RECEIVED: 'Đã tiếp nhận',
  PROCESSING: 'Đang xử lý',
  READY_FOR_PICKUP: 'Sẵn sàng trả',
  COMPLETED: 'Đã hoàn tất',
  CANCELLED: 'Đã hủy',
};

export function statusLabel(status) {
  if (!(status in labels)) throw new Error(`Unknown order status: ${status}`);
  return labels[status];
}
