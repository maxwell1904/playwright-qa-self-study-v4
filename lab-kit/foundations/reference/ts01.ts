export type Service = { code: string; name: string; unitPrice: number; active: boolean };

export function activeServices(services: Service[]): Service[] {
  return services.filter(service => service.active);
}

export function findService(services: Service[], code: string): Service | undefined {
  return services.find(service => service.code === code);
}

export function displayPrice(service: Service): string {
  return `${service.name}: ${service.unitPrice} VND`;
}

export type CustomerSnapshot = { name: string; phone: string };
export type OrderItem = { serviceCode: string; serviceName: string; unitPrice: number; quantity: number };
export type Order = { code: string; customer: CustomerSnapshot; items: OrderItem[] };

export function orderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function findItem(items: OrderItem[], serviceCode: string): OrderItem | undefined {
  return items.find(item => item.serviceCode === serviceCode);
}

export function orderSummary(order: Order): string {
  return `${order.code} | ${order.customer.name} | ${orderTotal(order.items)} VND`;
}

export function requireItem(items: OrderItem[], serviceCode: string): OrderItem {
  const item = findItem(items, serviceCode);
  if (!item) throw new Error(`Order item not found: ${serviceCode}`);
  return item;
}
