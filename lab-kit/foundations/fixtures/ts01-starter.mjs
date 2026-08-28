export const services = [
  { code: 'GIAT_SAY_KG', name: 'Giặt sấy quần áo', unitPrice: 25000, active: true },
  { code: 'DICH_VU_CU', name: 'Dịch vụ cũ', unitPrice: 10000, active: false },
];

export function activeServices(serviceList) {
  return serviceList.filter(service => service.active);
}

export function findService(serviceList, code) {
  return serviceList.find(service => service.code === code);
}

export function displayPrice(service) {
  return `${service.name}: ${service.unitPrice} VND`;
}
