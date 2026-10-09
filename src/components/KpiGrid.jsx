import KpiCard from './KpiCard';

export default function KpiGrid({ kpis }) {
  if (!kpis || kpis.length === 0) return null;

  return (
    <section className="kpi-grid" aria-label="Ключові показники">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} {...kpi} />
      ))}
    </section>
  );
}
