import Icon from './Icon';

export default function ErrorState({ error, onRetry, onUseFallback }) {
  return (
    <div className="state-panel error-state" role="alert" aria-live="assertive">
      <div className="state-icon-wrapper error-icon-bg">
        <Icon name="alert" size={36} />
      </div>
      <h3>Помилка завантаження даних із API</h3>
      <p className="state-error-message">
        {error || 'Не вдалося встановити з’єднання із сервером.'}
      </p>
      <div className="state-actions">
        {onRetry && (
          <button
            type="button"
            className="action-btn primary-btn"
            onClick={onRetry}
          >
            <Icon name="refresh" size={16} />
            Спробувати знову
          </button>
        )}
        {onUseFallback && (
          <button
            type="button"
            className="action-btn secondary-btn"
            onClick={onUseFallback}
          >
            <Icon name="rocket" size={16} />
            Використати резервні дані
          </button>
        )}
      </div>
    </div>
  );
}
