import { useState } from 'react';
import Icon from './Icon';
import WidgetPanel from './WidgetPanel';

export default function Counter({
  title,
  initialValue = 0,
  min = 0,
  max = 10,
  step = 1,
  unit,
}) {
  const [count, setCount] = useState(initialValue);

  return (
    <WidgetPanel
      title={title}
      eyebrow="Мій план"
      aside={<Icon name="rocket" />}
      className="counter-panel"
    >
      <p className="panel-description">
        Оберіть, скільки запусків плануєте переглянути.
      </p>
      <div className="stepper">
        <button
          className="icon-button"
          type="button"
          aria-label="Зменшити кількість"
          disabled={count <= min}
          onClick={() => setCount((previous) => Math.max(min, previous - step))}
        >
          <Icon name="minus" />
        </button>
        <p className="counter-number" aria-live="polite">
          <strong>{count}</strong>
          <span>{unit}</span>
        </p>
        <button
          className="icon-button"
          type="button"
          aria-label="Збільшити кількість"
          disabled={count >= max}
          onClick={() => setCount((previous) => Math.min(max, previous + step))}
        >
          <Icon name="plus" />
        </button>
      </div>
      <div className="counter-footer">
        <span>
          Від {min} до {max} запусків
        </span>
        <button
          type="button"
          className="text-button"
          onClick={() => setCount(initialValue)}
        >
          <Icon name="reset" size={15} />
          Скинути
        </button>
      </div>
    </WidgetPanel>
  );
}
