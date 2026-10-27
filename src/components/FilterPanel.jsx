import { Controller } from 'react-hook-form';
import Icon from './Icon';
import { DEFAULT_FILTERS, POPULAR_AGENCIES } from '../constants/filters';

export default function FilterPanel({
  control,
  reset,
  watchedValues,
  availableAgencies = [],
  onResetCustom,
  isLoading = false,
}) {
  const currentValues = watchedValues || DEFAULT_FILTERS;

  const activeFiltersCount = [
    Boolean(currentValues.search && currentValues.search.trim()),
    currentValues.agency !== 'all',
    currentValues.ordering !== 'net',
    Number(currentValues.limit) !== 25,
    currentValues.status !== 'all',
  ].filter(Boolean).length;

  const isFiltered = activeFiltersCount > 0;

  function handleReset() {
    reset(DEFAULT_FILTERS);
    if (onResetCustom) {
      onResetCustom();
    }
  }

  const agencyOptions = [...POPULAR_AGENCIES];
  availableAgencies.forEach((dynAgency) => {
    const exists = agencyOptions.some(
      (opt) => opt.id === dynAgency.id || opt.name === dynAgency.name,
    );
    if (!exists && dynAgency.name) {
      agencyOptions.push({ id: dynAgency.name, name: dynAgency.name });
    }
  });

  return (
    <div className="filter-panel-wrapper">
      <form
        className="filter-form"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Панель фільтрів та пошуку місій"
      >
        <div className="filter-fields-grid">
          <div className="filter-group search-group">
            <label htmlFor="filter-search" className="filter-field-label">
              <span>Пошук місії / ракети</span>
              {currentValues.search && (
                <span className="field-hint">400мс debounce</span>
              )}
            </label>
            <div className="input-with-icon">
              <Icon name="search" size={16} className="field-icon" />
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <input
                    id="filter-search"
                    type="search"
                    className="filter-input search-input"
                    placeholder="Наприклад: Falcon, Starlink, Electron..."
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    autoComplete="off"
                  />
                )}
              />
              {currentValues.search && (
                <button
                  type="button"
                  className="clear-field-btn"
                  onClick={() => reset({ ...currentValues, search: '' })}
                  title="Очистити пошук"
                  aria-label="Очистити пошук"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-agency" className="filter-field-label">
              <span>Космічна агенція</span>
            </label>
            <div className="select-wrapper">
              <Controller
                name="agency"
                control={control}
                render={({ field }) => (
                  <select
                    id="filter-agency"
                    className="filter-select"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {agencyOptions.map((agency) => (
                      <option key={agency.id} value={agency.id}>
                        {agency.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-ordering" className="filter-field-label">
              <span>Сортування API</span>
            </label>
            <div className="select-wrapper">
              <Controller
                name="ordering"
                control={control}
                render={({ field }) => (
                  <select
                    id="filter-ordering"
                    className="filter-select"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="net">Дата: спочатку найближчі ▲</option>
                    <option value="-net">Дата: спочатку пізніші ▼</option>
                    <option value="name">Назва: А → Я</option>
                    <option value="-name">Назва: Я → А</option>
                  </select>
                )}
              />
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-status" className="filter-field-label">
              <span>Статус запуску</span>
            </label>
            <div className="select-wrapper">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select
                    id="filter-status"
                    className="filter-select"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="all">Усі статуси</option>
                    <option value="go">Готовий до старту (Go)</option>
                    <option value="tbc">Очікує підтвердження (TBC/TBD)</option>
                    <option value="hold">Відкладено (Hold)</option>
                  </select>
                )}
              />
            </div>
          </div>

          <div className="filter-group limit-group">
            <label htmlFor="filter-limit" className="filter-field-label">
              <span>Кількість</span>
            </label>
            <div className="select-wrapper">
              <Controller
                name="limit"
                control={control}
                render={({ field }) => (
                  <select
                    id="filter-limit"
                    className="filter-select"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <option value={10}>10 місій</option>
                    <option value={20}>20 місій</option>
                    <option value={25}>25 місій</option>
                    <option value={50}>50 місій</option>
                  </select>
                )}
              />
            </div>
          </div>

          <div className="filter-actions-group">
            <button
              type="button"
              className={`reset-filters-btn ${isFiltered ? 'btn-active' : ''}`}
              onClick={handleReset}
              disabled={!isFiltered && !isLoading}
              title="Скинути всі фільтри до початкових значень"
            >
              <Icon name="reset" size={15} />
              <span>Скинути фільтри</span>
              {isFiltered && (
                <span className="active-badge">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>

        {isFiltered && (
          <div className="active-filters-bar">
            <span className="active-filters-label">Активні фільтри:</span>
            <div className="active-filters-pills">
              {currentValues.search && (
                <span className="filter-pill">
                  Пошук: <strong>&ldquo;{currentValues.search}&rdquo;</strong>
                  <button
                    type="button"
                    onClick={() => reset({ ...currentValues, search: '' })}
                    aria-label="Видалити фільтр пошуку"
                  >
                    ✕
                  </button>
                </span>
              )}
              {currentValues.agency !== 'all' && (
                <span className="filter-pill">
                  Агенція: <strong>{currentValues.agency}</strong>
                  <button
                    type="button"
                    onClick={() => reset({ ...currentValues, agency: 'all' })}
                    aria-label="Видалити фільтр агенції"
                  >
                    ✕
                  </button>
                </span>
              )}
              {currentValues.ordering !== 'net' && (
                <span className="filter-pill">
                  Сортування: <strong>{currentValues.ordering}</strong>
                  <button
                    type="button"
                    onClick={() => reset({ ...currentValues, ordering: 'net' })}
                    aria-label="Скинути сортування"
                  >
                    ✕
                  </button>
                </span>
              )}
              {currentValues.status !== 'all' && (
                <span className="filter-pill">
                  Статус: <strong>{currentValues.status.toUpperCase()}</strong>
                  <button
                    type="button"
                    onClick={() => reset({ ...currentValues, status: 'all' })}
                    aria-label="Видалити фільтр статусу"
                  >
                    ✕
                  </button>
                </span>
              )}
              {Number(currentValues.limit) !== 25 && (
                <span className="filter-pill">
                  Ліміт: <strong>{currentValues.limit}</strong>
                  <button
                    type="button"
                    onClick={() => reset({ ...currentValues, limit: 25 })}
                    aria-label="Скинути ліміт"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
