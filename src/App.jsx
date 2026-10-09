import './App.css';

import { dashboardInfo } from './data/mock';
import Dashboard from './components/Dashboard';
import MissionsContainer from './components/MissionsContainer';
import Counter from './components/Counter';
import Toggle from './components/Toggle';
import Icon from './components/Icon';

function App() {
  const todayFormatted = new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <Dashboard info={dashboardInfo}>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Космос ближче, ніж здається</p>
          <h1>
            Космічні запуски<span> / онлайн-моніторинг</span>
          </h1>
          <p>
            Актуальний розклад космічних місій, аналітика агенцій та прямий зв’язок із API.
          </p>
        </div>
        <div className="snapshot">
          <Icon name="calendar" size={17} />
          <span>Сьогодні: {todayFormatted}</span>
        </div>
      </section>
      <MissionsContainer currentYear={dashboardInfo.year} />
      <div className="controls-grid" id="plan">
        <Counter
          title="Запуски до перегляду"
          initialValue={2}
          min={0}
          max={10}
          step={1}
          unit="у моєму плані"
        />
        <Toggle
          title="Режим відображення"
          lightLabel="Світла тема"
          darkLabel="Темна тема"
          preview={{ label: 'На орбіті', title: 'Власний погляд на космос' }}
        />
      </div>
    </Dashboard>
  );
}

export default App;
