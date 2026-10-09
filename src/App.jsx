import './App.css'

import { agencies, dashboardInfo, missions } from './data/mock';
import { formatDate } from './utils/formatDate';

import Icon from './components/Icon';
import Dashboard from './components/Dashboard';

function App() {
  const launch = missions
    .filter((mission) =>
      mission.net >= dashboardInfo.snapshotISO &&
      mission.status.id !== 'hold'
    );

  const nextLaunch = launch.toSorted((left, right) =>
    new Date(left.net) - new Date(right.net)
  )[0];

  const totalLaunches = agencies.reduce(
    (total, agency) => total + agency.count,
    0,
  );

  const totalChange = agencies.reduce(
    (total, agency) => total + Number(agency.change),
    0,
  );

  const daysToNext = nextLaunch
    ? Math.ceil(
      (new Date(nextLaunch.net.slice(0, 10)) -
        new Date(dashboardInfo.snapshotISO.slice(0, 10))) /
      86400000,
    ) : 0;


  const kpis = [
    {
      id: 'next',
      title: 'Найближчий запуск',
      value: nextLaunch ? formatDate(nextLaunch.net) : '—',
      unit: '',
      change: nextLaunch ? `Через ${daysToNext} діб` : 'Немає місій',
      description: nextLaunch?.name ?? 'Очікуємо новий розклад',
      icon: 'rocket',
      accent: 'lavender',
    },
    {
      id: 'total',
      title: `Запуски у ${dashboardInfo.year}`,
      value: totalLaunches,
      unit: 'запусків',
      change: `+${totalChange}`,
      description: 'до попереднього демо-періоду',
      icon: 'calendar',
      accent: 'lime',
    },
    {
      id: 'agencies',
      title: 'Агенції в огляді',
      value: agencies.length.toString().padStart(2, '0'),
      unit: 'агенції',
      change: `+${agencies.length - dashboardInfo.previousAgencyCount}`,
      description: 'до попереднього демо-періоду',
      icon: 'globe',
      accent: 'peach',
    },
  ];

  return (
    <Dashboard info={dashboardInfo} missionCount={missions.length}>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Космос ближче, ніж здається</p>
          <h1>
            Космічні запуски<span> / огляд</span>
          </h1>
          <p>Місії, агенції та наступний крок за межі Землі.</p>
        </div>
        <div className="snapshot">
          <Icon name="calendar" size={17} />
          <span>Зріз на {dashboardInfo.snapshot}</span>
        </div>
      </section>
      <div className="demo-notice">
        <span className="demo-pill">MOCK DATA</span>
        <p>
          Усі місії, дати й показники демонстраційні.
        </p>
      </div>
      <section className="kpi-grid" aria-label="Ключові показники">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} />
        ))}
      </section>
    </Dashboard>
  )
}

export default App
