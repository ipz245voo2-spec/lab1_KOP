export default function AgencyChart({ agencies = [], year = new Date().getFullYear() }) {
  if (!agencies || agencies.length === 0) {
    return (
      <section className="agency-chart" aria-label="Запуски за агенціями">
        <div className="chart-heading">
          <div>
            <p className="eyebrow">Аналітика провайдерів</p>
            <h3>Запуски за агенціями</h3>
          </div>
          <span>{year}</span>
        </div>
        <p className="chart-description">Немає даних для побудови графіку.</p>
      </section>
    );
  }

  const counts = agencies.map((agency) => agency.count);
  const maximum = Math.max(1, ...counts);
  const total = counts.reduce((sum, count) => sum + count, 0);

  return (
    <section
      className="agency-chart"
      aria-label={`Запуски за агенціями у ${year} році`}
    >
      <div className="chart-heading">
        <div>
          <p className="eyebrow">Аналітика вибірки</p>
          <h3>Запуски за агенціями</h3>
        </div>
        <span>{year}</span>
      </div>
      <p className="chart-description">
        {total} {total === 1 ? 'запуск' : total < 5 ? 'запуски' : 'запусків'} розподілено між {agencies.length} провайдерами
      </p>
      <div className="bar-list">
        {agencies.map((agency) => {
          const percentage = Math.round((agency.count / maximum) * 100);
          return (
            <div className="bar-item" key={agency.id || agency.name}>
              <div className="bar-label">
                <span title={agency.name}>{agency.name}</span>
                <strong>{agency.count}</strong>
              </div>
              <div className="bar-track" aria-hidden="true">
                <div
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: agency.color || '#bfcaf0',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="chart-note">
        Показники розраховано на основі актуальних місій із The Space Devs API.
      </p>
    </section>
  );
}
