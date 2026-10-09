export default function WidgetPanel({
  title,
  eyebrow,
  aside,
  children,
  className = '',
}) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}
