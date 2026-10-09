import Icon from './Icon';

export default function LoadingState({
  message = 'Завантаження актуальних місій з API Space Devs...',
}) {
  return (
    <div className="state-panel loading-state" role="status" aria-live="polite">
      <div className="state-icon-wrapper pulse-animation">
        <Icon name="orbit" size={44} className="spinning-icon" />
      </div>
      <h3>{message}</h3>
      <p className="state-description">
        Підключаємось до ll.thespacedevs.com, оновлюємо розклад запуску ракет...
      </p>
      <div className="skeleton-grid" aria-hidden="true">
        <div className="skeleton-line full" />
        <div className="skeleton-line half" />
        <div className="skeleton-line quarter" />
      </div>
    </div>
  );
}
