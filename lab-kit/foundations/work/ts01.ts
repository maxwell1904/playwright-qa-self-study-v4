export type Service = {
  code: string; // TODO confirm the boundary type.
  name: string;
  unitPrice: number;
  active: boolean;
};

export function activeServices(_services: Service[]): Service[] {
  // TODO filter by active without mutating the input array.
  return [];
}

export function findService(_services: Service[], _code: string): Service | undefined {
  // TODO keep the honest undefined return from Array.find.
  return undefined;
}

export function displayPrice(_service: Service): string {
  return 'TODO';
}

export type CustomerSnapshot = { name: string; phone: string };
export type OrderItem = { serviceCode: string; serviceName: string; unitPrice: number; quantity: number };
export type Order = { code: string; customer: CustomerSnapshot; items: OrderItem[] };

export function orderTotal(_items: OrderItem[]): number {
  return 0; // TODO
}

export function findItem(_items: OrderItem[], _serviceCode: string): OrderItem | undefined {
  return undefined; // TODO
}

export function orderSummary(_order: Order): string {
  return 'TODO';
}

export function requireItem(_items: OrderItem[], serviceCode: string): OrderItem {
  throw new Error(`TODO require item ${serviceCode}`);
}
