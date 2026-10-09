import { useState } from 'react';
import WidgetPanel from './WidgetPanel';
import AgencyChart from './AgencyChart';
import MissionDetails from './MissionDetails';
import { formatDate } from '../utils/formatDate';

export default function FilteredList({ title, items, categories, year }) {
  const [categoryId, setCategoryId] = useState('all');
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? null);
  const filteredItems = items.filter(
    (item) => categoryId === 'all' || item.agencyId === categoryId,
  );
  const selectedMission =
    filteredItems.find((item) => item.id === selectedId) ??
    filteredItems[0] ??
    null;
  const getAgencyName = (id) =>
    categories.find((category) => category.id === id)?.name ??
    'Невідома агенція';

  function handleCategoryChange(event) {
    const nextCategory = event.target.value;
    setCategoryId(nextCategory);
    setSelectedId(
      items.find(
        (item) => nextCategory === 'all' || item.agencyId === nextCategory,
      )?.id ?? null,
    );
  }

  return (
    <WidgetPanel
      title={title}
      eyebrow="Календар місій"
      className="missions-panel"
      aside={
        <label className="filter-label">
          Агенція
          <select value={categoryId} onChange={handleCategoryChange}>
            <option value="all">Усі агенції</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      }
    >
      <div className="missions-layout">
        <div className="mission-list">
          <div className="list-summary">
            <p>Оберіть місію, щоб побачити ракету, майданчик і статус.</p>
            <span aria-live="polite">
              {filteredItems.length} із {items.length}
            </span>
          </div>
          <div className="table-scroll">
            <table>
              <caption className="sr-only">
                Майбутні місії на демонстраційних даних. Час у UTC.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Місія / агенція</th>
                  <th scope="col">Дата / UTC</th>
                  <th scope="col">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((mission) => (
                  <tr
                    key={mission.id}
                    className={
                      selectedMission?.id === mission.id ? 'selected-row' : ''
                    }
                  >
                    <td>
                      <button
                        type="button"
                        className="mission-button"
                        aria-pressed={selectedMission?.id === mission.id}
                        onClick={() => setSelectedId(mission.id)}
                      >
                        {mission.name}
                        <small>{getAgencyName(mission.agencyId)}</small>
                      </button>
                    </td>
                    <td>
                      <span className="mission-date">
                        {formatDate(mission.net)}
                      </span>
                      <small>
                        {new Intl.DateTimeFormat('uk-UA', {
                          timeZone: 'UTC',
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(new Date(mission.net))}
                      </small>
                    </td>
                    <td>
                      <span className={`status status-${mission.status.id}`}>
                        {mission.status.name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredItems.length === 0 && (
              <p className="empty-state">У цій категорії поки немає місій.</p>
            )}
          </div>
          <AgencyChart agencies={categories} year={year} />
        </div>
        <MissionDetails
          mission={selectedMission}
          agencyName={
            selectedMission ? getAgencyName(selectedMission.agencyId) : ''
          }
        />
      </div>
    </WidgetPanel>
  );
}
