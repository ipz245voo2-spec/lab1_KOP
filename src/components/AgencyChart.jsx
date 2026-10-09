export default function AgencyChart({ agencies, year }) {
  const maximum = Math.max(1, ...agencies.map((agency) => agency.count));
  const total = agencies.reduce((sum, agency) => sum + agency.count, 0);

  return (
    <section
      className="agency-chart"
      aria-label={`Запуски за агенціями у ${year} році`}
    >
      <div className="chart-heading">
        <div>
          <p className="eyebrow">Річний зріз</p>
          <h3>Запуски за агенціями</h3>
        </div>
        <span>{year}</span>
      </div>
      <p className="chart-description">
        {total} запусків у демонстраційному підсумку
      </p>
      <div className="bar-list">
        {agencies.map((agency) => (
          <div className="bar-item" key={agency.id}>
            <div className="bar-label">
              <span>{agency.name}</span>
              <strong>{agency.count}</strong>
            </div>
            <div className="bar-track" aria-hidden="true">
              <div
                style={{
                  width: `${(agency.count / maximum) * 100}%`,
                  backgroundColor: agency.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="chart-note">
        Підсумок року та майбутні місії — окремі набори mock-даних.
      </p>
    </section>
  );
}
