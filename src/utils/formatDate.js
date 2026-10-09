export function formatDate(value, options = {}) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('uk-UA', {
      timeZone: 'UTC',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...options,
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

export function formatTime(value) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('uk-UA', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return '';
  }
}

export function formatRelativeDays(netDate) {
  if (!netDate) return 'Немає дати';
  const target = new Date(netDate);
  const now = new Date();
  const diffMs = target - now;

  if (diffMs <= 0) {
    return 'Сьогодні / Стартував';
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 0) {
    return `Через ${diffHours} год`;
  }
  if (diffDays === 1) {
    return 'Завтра';
  }
  return `Через ${diffDays} діб`;
}
