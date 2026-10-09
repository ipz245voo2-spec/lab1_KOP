export const dashboardInfo = {
  student: 'Олексій Вишневський',
  group: 'ІПЗ-24-5',
  variant: 16,
  year: 2026,
  previousAgencyCount: 3,
  snapshot: '08 жовтня 2026',
  snapshotISO: '2026-10-08T00:00:00Z',
};

export const agencies = [
  { id: 'spacex', name: 'SpaceX', count: 84, change: '+12', color: '#bfcaf0' },
  { id: 'casc', name: 'CASC', count: 24, change: '+4', color: '#d8ec9e' },
  {
    id: 'rocketlab',
    name: 'Rocket Lab',
    count: 18,
    change: '+6',
    color: '#ebba9b',
  },
  {
    id: 'arianespace',
    name: 'Arianespace',
    count: 12,
    change: '+2',
    color: '#cfc5dd',
  },
];

export const missions = [
  {
    id: 'demo-01',
    name: 'Aurora Network · 01',
    agencyId: 'spacex',
    net: '2026-10-12T14:30:00Z',
    orbit: 'Низька навколоземна',
    status: { id: 'go', name: 'Готовий до запуску' },
    rocket: { configuration: { name: 'Falcon 9' } },
    pad: { name: 'SLC-40', location: { name: 'Канаверал, США' } },
    description:
      'Демонстраційна місія з виведення групи супутників зв’язку на низьку навколоземну орбіту.',
  },
  {
    id: 'demo-02',
    name: 'Jade Explorer · 02',
    agencyId: 'casc',
    net: '2026-10-15T06:15:00Z',
    orbit: 'Сонячно-синхронна',
    status: { id: 'scheduled', name: 'Заплановано' },
    rocket: { configuration: { name: 'Long March 4C' } },
    pad: { name: 'LC-9', location: { name: 'Тайюань, Китай' } },
    description:
      'Демонстраційна місія спостереження за Землею та збору знімків поверхні.',
  },
  {
    id: 'demo-03',
    name: 'Ocean Watch · 03',
    agencyId: 'rocketlab',
    net: '2026-10-18T09:00:00Z',
    orbit: 'Низька навколоземна',
    status: { id: 'scheduled', name: 'Заплановано' },
    rocket: { configuration: { name: 'Electron' } },
    pad: { name: 'LC-1A', location: { name: 'Махія, Нова Зеландія' } },
    description:
      'Демонстраційний супутник для спостереження за океаном і морськими маршрутами.',
  },
  {
    id: 'demo-04',
    name: 'Horizon Relay · 04',
    agencyId: 'arianespace',
    net: '2026-10-21T17:45:00Z',
    orbit: 'Геоперехідна',
    status: { id: 'hold', name: 'Відкладено' },
    rocket: { configuration: { name: 'Ariane 6' } },
    pad: { name: 'ELA-4', location: { name: 'Куру, Французька Гвіана' } },
    description:
      'Демонстраційний супутник зв’язку. Дата є умовною та потребує уточнення.',
  },
  {
    id: 'demo-05',
    name: 'Aurora Network · 05',
    agencyId: 'spacex',
    net: '2026-10-24T12:00:00Z',
    orbit: 'Низька навколоземна',
    status: { id: 'scheduled', name: 'Заплановано' },
    rocket: { configuration: { name: 'Falcon 9' } },
    pad: { name: 'LC-39A', location: { name: 'Кеннеді, США' } },
    description:
      'Демонстраційна місія розширення орбітальної мережі супутників зв’язку.',
  },
  {
    id: 'demo-06',
    name: 'Polar Scout · 06',
    agencyId: 'rocketlab',
    net: '2026-10-28T03:20:00Z',
    orbit: 'Сонячно-синхронна',
    status: { id: 'go', name: 'Готовий до запуску' },
    rocket: { configuration: { name: 'Electron' } },
    pad: { name: 'LC-1B', location: { name: 'Махія, Нова Зеландія' } },
    description:
      'Демонстраційна місія для дослідження полярних регіонів Землі.',
  },
];
