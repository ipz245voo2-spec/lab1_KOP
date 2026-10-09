import { formatDate, formatTime, formatRelativeDays } from '../utils/formatDate';

export default function MissionDetails({ mission }) {
  if (!mission) {
    return (
      <section className="mission-details">
        <p className="no-selection">Оберіть місію у таблиці, щоб переглянути детальний дрілдаун.</p>
      </section>
    );
  }

  const agencyName =
    mission.launch_service_provider?.name ||
    mission.agencyName ||
    'Невідомий оператор';
  const rocketName =
    mission.rocket?.configuration?.name || 'Дані уточнюються';
  const rocketFamily = mission.rocket?.configuration?.family || '';
  const padName = mission.pad?.name || 'Не вказано';
  const locationName =
    mission.pad?.location?.name || 'Координати невідомі';
  const statusName = mission.status?.name || 'Заплановано';
  const statusDesc =
    mission.status?.description || 'Статус оновлюється космічним агентством.';
  const orbitName =
    mission.mission?.orbit?.name || mission.orbit || 'Навколоземна орбіта';
  const description =
    mission.mission?.description ||
    mission.description ||
    'Детальний опис корисного навантаження та цілей місії очікується.';
  const countdownText = formatRelativeDays(mission.net);

  const getStatusClass = (statusObj) => {
    const abbrev = (statusObj?.abbrev || '').toLowerCase();
    const name = (statusObj?.name || '').toLowerCase();
    if (abbrev === 'go' || name.includes('go')) return 'status-go';
    if (abbrev === 'hold' || name.includes('hold')) return 'status-hold';
    return 'status-scheduled';
  };

  return (
    <section
      className="mission-details"
      aria-label="Деталі місії"
      aria-live="polite"
    >
      <div className="details-top">
        <p className="eyebrow">Дрілдаун місії</p>
        <span className="countdown-pill">{countdownText}</span>
      </div>

      <h3>{mission.name}</h3>

      {mission.image && (
        <div className="mission-image-container">
          <img
            src={mission.image}
            alt={mission.name}
            className="mission-thumbnail"
            loading="lazy"
          />
        </div>
      )}

      <p className="mission-description">{description}</p>

      <dl>
        <div>
          <dt>Агенція (Оператор)</dt>
          <dd>{agencyName}</dd>
        </div>
        <div>
          <dt>Ракета-носій</dt>
          <dd>
            {rocketName}
            {rocketFamily && rocketFamily !== rocketName && (
              <small>Сімейство: {rocketFamily}</small>
            )}
          </dd>
        </div>
        <div>
          <dt>Стартовий майданчик</dt>
          <dd>
            {padName}
            <small>{locationName}</small>
          </dd>
        </div>
        <div>
          <dt>Статус готовності</dt>
          <dd>
            <span className={`status ${getStatusClass(mission.status)}`}>
              {statusName}
            </span>
            <small className="status-desc-text">{statusDesc}</small>
          </dd>
        </div>
        <div>
          <dt>Дата та час старту</dt>
          <dd>
            {formatDate(mission.net)} · {formatTime(mission.net)} UTC
          </dd>
        </div>
        <div>
          <dt>Цільова орбіта</dt>
          <dd>{orbitName}</dd>
        </div>
        {mission.orbital_launch_attempt_count_year && (
          <div>
            <dt>Спроба запуску у році</dt>
            <dd>№ {mission.orbital_launch_attempt_count_year}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
