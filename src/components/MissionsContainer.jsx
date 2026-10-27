import { useState, useMemo, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDebounce, useFetch } from '../hooks';
import { launchApiService } from '../services/launchApi';
import { formatDate, formatRelativeDays } from '../utils/formatDate';
import { DEFAULT_FILTERS } from '../constants/filters';

import WidgetPanel from './WidgetPanel';
import FilterPanel from './FilterPanel';
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

export default function MissionsContainer({
  currentYear = new Date().getFullYear(),
}) {
  const { control, reset, setValue } = useForm({
    defaultValues: DEFAULT_FILTERS,
  });

  const formValues = useWatch({ control, defaultValue: DEFAULT_FILTERS });
  const debouncedSearch = useDebounce(formValues.search, 400);

  const [simulateError, setSimulateError] = useState(false);
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      agency: formValues.agency,
      ordering: formValues.ordering,
      limit: formValues.limit,
      status: formValues.status,
      simulateError,
      simulateEmpty,
      useFallback: isFallbackMode,
    }),
    [
      debouncedSearch,
      formValues.agency,
      formValues.ordering,
      formValues.limit,
      formValues.status,
      simulateError,
      simulateEmpty,
      isFallbackMode,
    ],
  );

  const fetcher = useCallback((params, options) => {
    return launchApiService.getUpcomingLaunches({
      ...params,
      ...options,
    });
  }, []);

  const {
    data: rawLaunches,
    loading: isLoading,
    error,
    refetch,
  } = useFetch(fetcher, queryParams, {
    initialData: [],
  });

  const launches = useMemo(() => rawLaunches || [], [rawLaunches]);

  const [selectedId, setSelectedId] = useState(null);
  const [localSortField, setLocalSortField] = useState(null);
  const [localSortDirection, setLocalSortDirection] = useState('asc');

  function handleRetry() {
    setSimulateError(false);
    setSimulateEmpty(false);
    refetch();
  }

  function handleUseFallback() {
    setIsFallbackMode(true);
    setSimulateError(false);
    setSimulateEmpty(false);
  }

  function handleFullReset() {
    reset(DEFAULT_FILTERS);
    setSimulateError(false);
    setSimulateEmpty(false);
    setIsFallbackMode(false);
    setLocalSortField(null);
  }

  function handleTableSort(field) {
    if (field === 'flightNumber') {
      if (localSortField === 'flightNumber') {
        setLocalSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setLocalSortField('flightNumber');
        setLocalSortDirection('asc');
      }
      return;
    }

    setLocalSortField(null);

    if (field === 'net') {
      const nextOrdering = formValues.ordering === 'net' ? '-net' : 'net';
      setValue('ordering', nextOrdering);
    } else if (field === 'name') {
      const nextOrdering = formValues.ordering === 'name' ? '-name' : 'name';
      setValue('ordering', nextOrdering);
    } else if (field === 'agency') {
      const nextOrdering = formValues.ordering === 'name' ? '-name' : 'name';
      setValue('ordering', nextOrdering);
    }
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

  const sortedMissions = useMemo(() => {
    if (localSortField === 'flightNumber') {
      return [...launches].sort((a, b) => {
        const numA = a.orbital_launch_attempt_count_year ?? 0;
        const numB = b.orbital_launch_attempt_count_year ?? 0;
        return localSortDirection === 'asc' ? numA - numB : numB - numA;
      });
    }
    return launches;
  }, [launches, localSortField, localSortDirection]);

  const selectedMission =
    sortedMissions.find((m) => m.id === selectedId) ||
    sortedMissions[0] ||
    null;

  const upcomingChronological = useMemo(() => {
    return [...launches].sort((a, b) => new Date(a.net) - new Date(b.net));
  }, [launches]);

  const nextLaunch = upcomingChronological[0] ?? null;

  const launchesThisYear = useMemo(() => {
    return launches.filter(
      (m) => new Date(m.net).getFullYear() === currentYear,
    );
  }, [launches, currentYear]);

  const yearDisplayCount =
    launchesThisYear.length > 0 ? launchesThisYear.length : launches.length;

  const kpis = useMemo(
    () => [
      {
        id: 'next',
        title: 'Найближчий запуск',
        value: nextLaunch ? formatDate(nextLaunch.net) : '—',
        unit: '',
        change: nextLaunch
          ? formatRelativeDays(nextLaunch.net)
          : 'Немає у вибірці',
        description: nextLaunch
          ? `${nextLaunch.name} (${nextLaunch.launch_service_provider?.name || 'Оператор'})`
          : 'Змініть параметри пошуку',
        icon: 'rocket',
        accent: 'lavender',
      },
      {
        id: 'total',
        title: `Запуски у вибірці (${currentYear})`,
        value: yearDisplayCount,
        unit: 'запусків',
        change: isFallbackMode
          ? 'Резервна копія'
          : `Ліміт: ${formValues.limit}`,
        description: `активні місії за фільтрами (всього: ${launches.length})`,
        icon: 'calendar',
        accent: 'lime',
      },
      {
        id: 'agencies',
        title: 'Агенції у вибірці',
        value: dynamicAgencies.length.toString().padStart(2, '0'),
        unit: 'агенції',
        change: `Топ: ${dynamicAgencies[0]?.name || '—'}`,
        description: 'провайдери за поточним запитом',
        icon: 'globe',
        accent: 'peach',
      },
    ],
    [
      nextLaunch,
      currentYear,
      yearDisplayCount,
      isFallbackMode,
      formValues.limit,
      launches.length,
      dynamicAgencies,
    ],
  );

  const tableSortField =
    localSortField ||
    (formValues.ordering.includes('name') ? 'name' : 'net');
  const tableSortDirection = localSortField
    ? localSortDirection
    : formValues.ordering.startsWith('-')
      ? 'desc'
      : 'asc';

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
              ? 'useFetch: виконується запит...'
              : error
                ? 'Помилка підключення до API'
                : isFallbackMode
                  ? 'Використовуються резервні дані (Offline)'
                  : 'ЛР3 · Space Devs API + react-hook-form + useDebounce + useFetch'}
          </span>
        </div>

        <div
          className="api-test-tools"
          aria-label="Інструменти тестування станів"
        >
          <button
            type="button"
            className="test-btn"
            title="Оновити дані через useFetch.refetch()"
            disabled={isLoading}
            onClick={handleRetry}
          >
            <Icon name="refresh" size={13} />
            Оновити
          </button>
          <button
            type="button"
            className={`test-btn ${simulateError ? 'test-btn-active' : ''}`}
            title="Змоделювати стан Error для захисту"
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
            title="Змоделювати стан Empty для захисту"
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

      <WidgetPanel
        title="Космічні запуски та розклад місій"
        eyebrow="Контрольована форма фільтрів · useDebounce + useFetch"
        className="missions-panel"
      >
        <FilterPanel
          control={control}
          reset={reset}
          watchedValues={formValues}
          availableAgencies={dynamicAgencies}
          onResetCustom={handleFullReset}
          isLoading={isLoading}
        />

        {isLoading ? (
          <LoadingState message="useFetch завантажує актуальні місії з API Space Devs..." />
        ) : error ? (
          <ErrorState
            error={error}
            onRetry={handleRetry}
            onUseFallback={handleUseFallback}
          />
        ) : launches.length === 0 ? (
          <EmptyState
            title="Місій не знайдено за заданими фільтрами"
            message="Спробуйте змінити пошуковий запит, обрати іншу агенцію або натисніть «Скинути фільтри»."
            onReset={handleFullReset}
          />
        ) : (
          <>
            <KpiGrid kpis={kpis} />

            <div className="missions-layout">
              <div className="mission-list">
                <div className="list-summary">
                  <p>
                    Знайдено <strong>{sortedMissions.length}</strong> місій
                    {formValues.search && (
                      <span>
                        {' '}
                        за запитом &ldquo;{formValues.search}&rdquo;
                      </span>
                    )}
                    . Клікніть на рядок або колонку для сортування.
                  </p>
                  <span aria-live="polite">
                    Показано {sortedMissions.length}
                  </span>
                </div>

                <MissionsTable
                  missions={sortedMissions}
                  selectedId={selectedMission?.id}
                  sortField={tableSortField}
                  sortDirection={tableSortDirection}
                  onSort={handleTableSort}
                  onSelect={(id) => setSelectedId(id)}
                />

                <AgencyChart
                  agencies={dynamicAgencies}
                  year={currentYear}
                />
              </div>

              <MissionDetails mission={selectedMission} />
            </div>
          </>
        )}
      </WidgetPanel>
    </div>
  );
}
