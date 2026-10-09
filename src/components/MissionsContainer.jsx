import { useState, useEffect } from 'react';
import {
  launchApiService,
  FALLBACK_LAUNCHES,
} from '../services/launchApi';
import { formatDate, formatRelativeDays } from '../utils/formatDate';

import WidgetPanel from './WidgetPanel';
import MissionsTable from './MissionsTable';
import MissionDetails from './MissionDetails';
import AgencyChart from './AgencyChart';
import KpiGrid from './KpiGrid';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import Icon from './Icon';

const AGENCY_PALETTE = [
  '#bfcaf0',
  '#d8ec9e',
  '#ebba9b',
  '#cfc5dd',
  '#f5d398',
  '#b2e2d8',
  '#f1b8c4',
  '#c7d7e8',
];

export default function MissionsContainer({ currentYear = new Date().getFullYear() }) {
  const [launches, setLaunches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortField, setSortField] = useState('net');
  const [sortDirection, setSortDirection] = useState('asc');

  const [selectedId, setSelectedId] = useState(null);
  const [agencyFilter, setAgencyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [simulateError, setSimulateError] = useState(false);
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [reloadIndex, setReloadIndex] = useState(0);
 
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function loadMissions() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await launchApiService.getUpcomingLaunches({
          limit: 25,
          signal: controller.signal,
          simulateError,
          simulateEmpty,
        });

        if (isMounted) {
          setLaunches(data);
          setIsFallbackMode(false);
          if (data.length > 0) {
            setSelectedId((prev) => {
              const stillExists = data.some((m) => m.id === prev);
              return stillExists ? prev : data[0].id;
            });
          }
        }
      } catch (err) {
        if (
          err.name !== 'AbortError' &&
          err.name !== 'CanceledError' &&
          isMounted
        ) {
          setError(err.message || 'Не вдалося завантажити дані з API.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMissions();
 
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [reloadIndex, simulateError, simulateEmpty]);
 
  function handleRetry() {
    setSimulateError(false);
    setSimulateEmpty(false);
    setReloadIndex((prev) => prev + 1);
  }

  function handleUseFallback() {
    setIsLoading(false);
    setError(null);
    setLaunches(FALLBACK_LAUNCHES);
    setIsFallbackMode(true);
    if (FALLBACK_LAUNCHES.length > 0) {
      setSelectedId(FALLBACK_LAUNCHES[0].id);
    }
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  function handleResetFilters() {
    setAgencyFilter('all');
    setSearchQuery('');
  }
 
  const agencyMap = {};
  for (const launch of launches) {
    const name = launch.launch_service_provider?.name || 'Інші оператори';
    agencyMap[name] = (agencyMap[name] || 0) + 1;
  }

  const dynamicAgencies = Object.entries(agencyMap)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count], index) => ({
      id: name,
      name,
      count,
      color: AGENCY_PALETTE[index % AGENCY_PALETTE.length],
    }));
 
  const filteredMissions = launches.filter((mission) => {
    const agencyName =
      mission.launch_service_provider?.name || 'Інші оператори';
    const matchesAgency =
      agencyFilter === 'all' || agencyName === agencyFilter;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (mission.name || '').toLowerCase().includes(query) ||
      agencyName.toLowerCase().includes(query) ||
      (mission.rocket?.configuration?.name || '')
        .toLowerCase()
        .includes(query);

    return matchesAgency && matchesSearch;
  });
 
  const sortedMissions = [...filteredMissions].sort((left, right) => {
    let comparison;

    switch (sortField) {
      case 'net':
        comparison = new Date(left.net) - new Date(right.net);
        break;
      case 'name':
        comparison = (left.name || '').localeCompare(
          right.name || '',
          'uk-UA',
        );
        break;
      case 'agency': {
        const agencyA = left.launch_service_provider?.name || '';
        const agencyB = right.launch_service_provider?.name || '';
        comparison = agencyA.localeCompare(agencyB, 'uk-UA');
        break;
      }
      case 'flightNumber': {
        const numA = left.orbital_launch_attempt_count_year ?? 0;
        const numB = right.orbital_launch_attempt_count_year ?? 0;
        comparison = numA - numB;
        break;
      }
      case 'status': {
        const statusA = left.status?.name || '';
        const statusB = right.status?.name || '';
        comparison = statusA.localeCompare(statusB, 'uk-UA');
        break;
      }
      default:
        comparison = 0;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

 
  const selectedMission =
    sortedMissions.find((m) => m.id === selectedId) ??
    sortedMissions[0] ??
    null;

  const upcomingChronological = [...launches].sort(
    (a, b) => new Date(a.net) - new Date(b.net),
  );
  const nextLaunch = upcomingChronological[0] ?? null;

  const launchesThisYear = launches.filter(
    (m) => new Date(m.net).getFullYear() === currentYear,
  );
  const yearDisplayCount =
    launchesThisYear.length > 0 ? launchesThisYear.length : launches.length;

  const kpis = [
    {
      id: 'next',
      title: 'Найближчий запуск',
      value: nextLaunch ? formatDate(nextLaunch.net) : '—',
      unit: '',
      change: nextLaunch ? formatRelativeDays(nextLaunch.net) : 'Немає даних',
      description: nextLaunch
        ? `${nextLaunch.name} (${nextLaunch.launch_service_provider?.name || 'Оператор'})`
        : 'Очікуємо розклад',
      icon: 'rocket',
      accent: 'lavender',
    },
    {
      id: 'total',
      title: `Запуски у ${currentYear}`,
      value: yearDisplayCount,
      unit: 'запусків',
      change: isFallbackMode
        ? 'Резервна копія'
        : `+${launches.length} у вибірці API`,
      description: 'заплановані місії в активному розкладі',
      icon: 'calendar',
      accent: 'lime',
    },
    {
      id: 'agencies',
      title: 'Агенції в огляді',
      value: dynamicAgencies.length.toString().padStart(2, '0'),
      unit: 'агенції',
      change: `Топ: ${dynamicAgencies[0]?.name || 'SpaceX'}`,
      description: 'провайдери з активними місіями',
      icon: 'globe',
      accent: 'peach',
    },
  ];

  return (
    <div className="missions-container-root"> 
      <div className="live-api-bar">
        <div className="api-status-info">
          <span
            className={`api-indicator-dot ${
              isLoading
                ? 'indicator-loading'
                : error
                  ? 'indicator-error'
                  : 'indicator-live'
            }`}
          />
          <span className="api-status-text">
            {isLoading
              ? 'Запит до API виконується...'
              : error
                ? 'Помилка підключення до API'
                : isFallbackMode
                  ? 'Використовуються резервні дані (Offline)'
                  : 'API The Space Devs (ll.thespacedevs.com) · Пряме підключення'}
          </span>
        </div>
 
        <div className="api-test-tools" aria-label="Інструменти тестування станів">
          <button
            type="button"
            className="test-btn"
            title="Оновити дані з API"
            disabled={isLoading}
            onClick={handleRetry}
          >
            <Icon name="refresh" size={13} />
            Оновити
          </button>
          <button
            type="button"
            className={`test-btn ${simulateError ? 'test-btn-active' : ''}`}
            title="Змоделювати помилку сервера для демонстрації стану Error"
            onClick={() => {
              setSimulateEmpty(false);
              setSimulateError((prev) => !prev);
            }}
          >
            <Icon name="alert" size={13} />
            {simulateError ? 'Вимкнути Error' : 'Тест: Error'}
          </button>
          <button
            type="button"
            className={`test-btn ${simulateEmpty ? 'test-btn-active' : ''}`}
            title="Змоделювати порожню відповідь для демонстрації стану Empty"
            onClick={() => {
              setSimulateError(false);
              setSimulateEmpty((prev) => !prev);
            }}
          >
            <Icon name="globe" size={13} />
            {simulateEmpty ? 'Вимкнути Empty' : 'Тест: Empty'}
          </button>
        </div>
      </div>
 
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          error={error}
          onRetry={handleRetry}
          onUseFallback={handleUseFallback}
        />
      ) : launches.length === 0 ? (
        <EmptyState
          title="Немає запусків у базі API"
          message="Сервер повернув порожній список місій або режим тестування Empty активний."
          onReset={handleRetry}
        />
      ) : (
        <> 
          <KpiGrid kpis={kpis} />
 
          <div id="missions">
            <WidgetPanel
              title="Найближчі космічні місії"
              eyebrow="Таблиця запусків · реальні дані"
              className="missions-panel"
              aside={
                <div className="panel-controls-row"> 
                  <div className="search-box">
                    <Icon name="search" size={14} className="search-icon" />
                    <input
                      type="search"
                      placeholder="Пошук місії / ракети..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Пошук місії"
                    />
                  </div>
 
                  <label className="filter-label">
                    <span>Агенція</span>
                    <select
                      value={agencyFilter}
                      onChange={(e) => setAgencyFilter(e.target.value)}
                      aria-label="Фільтр за космічною агенцією"
                    >
                      <option value="all">Усі агенції ({launches.length})</option>
                      {dynamicAgencies.map((agency) => (
                        <option key={agency.id} value={agency.name}>
                          {agency.name} ({agency.count})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              }
            >
              <div className="missions-layout">
                <div className="mission-list">
                  <div className="list-summary">
                    <p>
                      Клікніть на рядок або колонку для сортування (
                      <strong>
                        {sortField === 'net'
                          ? 'за датою'
                          : sortField === 'name'
                            ? 'за назвою'
                            : sortField === 'agency'
                              ? 'за агенцією'
                              : sortField === 'flightNumber'
                                ? 'за № польоту'
                                : 'за статусом'}
                        {' '}({sortDirection === 'asc' ? 'зростання ▲' : 'спадання ▼'})
                      </strong>
                      ).
                    </p>
                    <span aria-live="polite">
                      Відображено {sortedMissions.length} із {launches.length}
                    </span>
                  </div>

                  {sortedMissions.length === 0 ? (
                    <EmptyState
                      title="Нічого не знайдено"
                      message="За вказаними критеріями пошуку або фільтра немає місій."
                      onReset={handleResetFilters}
                    />
                  ) : (
                    <MissionsTable
                      missions={sortedMissions}
                      selectedId={selectedMission?.id}
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                      onSelect={(id) => setSelectedId(id)}
                    />
                  )}
 
                  <AgencyChart
                    agencies={dynamicAgencies}
                    year={currentYear}
                  />
                </div>
 
                <MissionDetails mission={selectedMission} />
              </div>
            </WidgetPanel>
          </div>
        </>
      )}
    </div>
  );
}
