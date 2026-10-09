import { useState } from 'react';
import Icon from './Icon';
import WidgetPanel from './WidgetPanel';

export default function Toggle({
  title,
  lightLabel,
  darkLabel,
  initialDark = false,
  preview,
}) {
  const [isDark, setIsDark] = useState(initialDark);

  return (
    <WidgetPanel
      title={title}
      eyebrow="Вигляд секції"
      className={`toggle-panel ${isDark ? 'dark-preview' : ''}`}
    >
      <div className="toggle-row">
        <div>
          <p className="mode-label">
            <Icon name={isDark ? 'moon' : 'sun'} />
            {isDark ? darkLabel : lightLabel}
          </p>
          <p className="panel-description">
            Оберіть комфортну тему цієї секції.
          </p>
        </div>
        <button
          className="switch"
          type="button"
          role="switch"
          aria-label="Темна тема секції"
          aria-checked={isDark}
          onClick={() => setIsDark((previous) => !previous)}
        >
          <span />
        </button>
      </div>
      <div className="theme-preview">
        <span className="preview-orbit">
          <Icon name="orbit" size={38} />
        </span>
        <div>
          <span className="eyebrow">{preview.label}</span>
          <p>{preview.title}</p>
        </div>
        <span className="preview-dot" />
      </div>
      <p className="theme-caption">
        {isDark ? 'Нічний режим увімкнено' : 'Денний режим увімкнено'}
      </p>
    </WidgetPanel>
  );
}
