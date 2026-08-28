type Service = {
  code: string;
  name: string;
  unitPrice: number;
  active: boolean;
};

const services: Service[] = [
  { code: 'GIAT_SAY_KG', name: 'Giặt sấy quần áo', unitPrice: 25000, active: true },
  { code: 'OLD', name: 'Dịch vụ cũ', unitPrice: 1, active: false }
];

function findService(items: Service[], code: string): Service | undefined {
  return items.find(service => service.code === code);
}

const target = findService(services, 'GIAT_SAY_KG');
if (target !== undefined) console.log(`${target.name}: ${target.unitPrice} VND`);
