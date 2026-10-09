import { formatDate, formatTime } from '../utils/formatDate';

export default function MissionsTable({
  missions,
  selectedId,
  sortField,
  sortDirection,
  onSort,
  onSelect,
}) {
  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <span className="sort-indicator neutral">↕</span>;
    }
    return (
      <span className="sort-indicator active">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  const getAriaSort = (field) => {
    if (sortField !== field) return 'none';
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  const getStatusClass = (statusObj) => {
    const abbrev = (statusObj?.abbrev || '').toLowerCase();
    const name = (statusObj?.name || '').toLowerCase();
    if (abbrev === 'go' || name.includes('go')) return 'status-go';
    if (abbrev === 'hold' || name.includes('hold')) return 'status-hold';
    if (abbrev === 'tbd' || abbrev === 'tbc' || name.includes('scheduled')) {
      return 'status-scheduled';
    }
    return 'status-scheduled';
  };

  return (
    <div className="table-scroll">
      <table className="missions-data-table">
        <caption className="sr-only">
          Таблиця космічних запусків за даними The Space Devs API
        </caption>
        <thead>
          <tr>
            <th scope="col" aria-sort={getAriaSort('name')}>
              <button
                type="button"
                className="sort-header-btn"
                onClick={() => onSort('name')}
                title="Сортувати за назвою місії"
              >
                <span>Місія / Назва</span>
                {getSortIcon('name')}
              </button>
            </th>
            <th scope="col" aria-sort={getAriaSort('agency')}>
              <button
                type="button"
                className="sort-header-btn"
                onClick={() => onSort('agency')}
                title="Сортувати за агенцією"
              >
                <span>Агенція</span>
                {getSortIcon('agency')}
              </button>
            </th>
            <th scope="col" aria-sort={getAriaSort('net')}>
              <button
                type="button"
                className="sort-header-btn"
                onClick={() => onSort('net')}
                title="Сортувати за датою"
              >
                <span>Дата / UTC</span>
                {getSortIcon('net')}
              </button>
            </th>
            <th scope="col">Ракета</th>
            <th scope="col">Майданчик / Локація</th>
            <th scope="col" aria-sort={getAriaSort('flightNumber')}>
              <button
                type="button"
                className="sort-header-btn"
                onClick={() => onSort('flightNumber')}
                title="Сортувати за номером польоту в році (числовий показник)"
              >
                <span>№ у році</span>
                {getSortIcon('flightNumber')}
              </button>
            </th>
            <th scope="col" aria-sort={getAriaSort('status')}>
              <button
                type="button"
                className="sort-header-btn"
                onClick={() => onSort('status')}
                title="Сортувати за статусом"
              >
                <span>Статус</span>
                {getSortIcon('status')}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission) => {
            const isSelected = selectedId === mission.id;
            const agencyName =
              mission.launch_service_provider?.name || 'Невідомий оператор';
            const rocketName =
              mission.rocket?.configuration?.name || 'Не вказано';
            const padName = mission.pad?.name || 'Майданчик не вказано';
            const locationName =
              mission.pad?.location?.name || 'Локація не вказана';
            const flightYearNum =
              mission.orbital_launch_attempt_count_year ?? '—';
            const statusName =
              mission.status?.name || mission.status?.abbrev || 'Заплановано';

            return (
              <tr
                key={mission.id}
                className={isSelected ? 'selected-row' : ''}
                onClick={() => onSelect(mission.id)}
              >
                <td>
                  <button
                    type="button"
                    className="mission-button"
                    aria-pressed={isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(mission.id);
                    }}
                  >
                    <span className="mission-name-text">{mission.name}</span>
                    <small>
                      {mission.mission?.orbit?.name ||
                        mission.mission?.type ||
                        'Орбітальна місія'}
                    </small>
                  </button>
                </td>
                <td>
                  <span className="agency-cell-name">{agencyName}</span>
                </td>
                <td>
                  <span className="mission-date">{formatDate(mission.net)}</span>
                  <small>{formatTime(mission.net)} UTC</small>
                </td>
                <td>
                  <span className="rocket-name-badge">{rocketName}</span>
                </td>
                <td>
                  <div className="pad-cell">
                    <span className="pad-name">{padName}</span>
                    <small className="pad-location" title={locationName}>
                      {locationName}
                    </small>
                  </div>
                </td>
                <td>
                  <span className="flight-number-pill">
                    #{flightYearNum}
                  </span>
                </td>
                <td>
                  <span className={`status ${getStatusClass(mission.status)}`}>
                    {statusName}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
