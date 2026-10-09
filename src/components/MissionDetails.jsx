import Icon from './Icon';
import { formatDate } from '../utils/formatDate';

export default function MissionDetails({ mission, agencyName }) {
  if (!mission)
    return (
      <section className="mission-details">
        <p>Оберіть місію, щоб переглянути деталі.</p>
      </section>
    );

  return (
    <section
      className="mission-details"
      aria-label="Деталі місії"
      aria-live="polite"
    >
      <div className="details-top">
        <p className="eyebrow">Деталі місії</p>
        <Icon name="arrow" size={16} />
      </div>
      <h3>{mission.name}</h3>
      <p className="mission-description">{mission.description}</p>
      <dl>
        <div>
          <dt>Агенція</dt>
          <dd>{agencyName}</dd>
        </div>
        <div>
          <dt>Ракета</dt>
          <dd>{mission.rocket.configuration.name}</dd>
        </div>
        <div>
          <dt>Майданчик</dt>
          <dd>
            {mission.pad.name}
            <small>{mission.pad.location.name}</small>
          </dd>
        </div>
        <div>
          <dt>Статус</dt>
          <dd>
            <span className={`status status-${mission.status.id}`}>
              {mission.status.name}
            </span>
          </dd>
        </div>
        <div>
          <dt>Дата / UTC</dt>
          <dd>
            {formatDate(mission.net, {
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </dd>
        </div>
        <div>
          <dt>Орбіта</dt>
          <dd>{mission.orbit}</dd>
        </div>
      </dl>
    </section>
  );
}
