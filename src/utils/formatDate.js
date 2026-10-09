export function formatDate(value, options = {}) {
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'short',
    ...options,
  }).format(new Date(value));
}
