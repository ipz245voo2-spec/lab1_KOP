import Icon from './Icon';

export default function KpiCard({
  title,
  value,
  unit,
  change,
  description,
  icon,
  accent,
}) {
  return (
    <article className={`kpi-card kpi-${accent}`}>
      <div className="kpi-top">
        <h2>{title}</h2>
        <Icon name={icon} />
      </div>
      <p className="kpi-value">
        {value}
        <span>{unit}</span>
      </p>
      <div className="kpi-bottom">
        <span className="change">{change}</span>
        <p>{description}</p>
      </div>
    </article>
  );
}
