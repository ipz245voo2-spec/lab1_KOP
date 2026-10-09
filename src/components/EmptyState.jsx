import Icon from './Icon';

export default function EmptyState({
  title = 'Місій не знайдено',
  message = 'За вказаними критеріями або у вибірці немає активних запусків.',
  onReset,
}) {
  return (
    <div className="state-panel empty-state-panel" role="status">
      <div className="state-icon-wrapper empty-icon-bg">
        <Icon name="globe" size={36} />
      </div>
      <h3>{title}</h3>
      <p className="state-description">{message}</p>
      {onReset && (
        <div className="state-actions">
          <button
            type="button"
            className="action-btn secondary-btn"
            onClick={onReset}
          >
            <Icon name="reset" size={16} />
            Скинути фільтри
          </button>
        </div>
      )}
    </div>
  );
}
