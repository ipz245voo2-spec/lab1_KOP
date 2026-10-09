import Icon from './Icon';

export default function Dashboard({ info, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="Орбіта — огляд">
          <span className="brand-icon">
            <Icon name="orbit" size={29} />
          </span>
          <span>
            орбіта<span className="brand-subtitle">launch intelligence</span>
          </span>
        </a>
        <div className="sidebar-body">
          <p className="sidebar-label">Робочий простір</p>
          <nav aria-label="Навігація">
            <a className="nav-link active" href="#overview">
              <Icon name="globe" />
              Огляд
            </a>
            <a className="nav-link" href="#missions">
              <Icon name="rocket" />
              Місії
            </a>
            <a className="nav-link" href="#plan">
              <Icon name="calendar" />
              Мій план
            </a>
          </nav>
        </div>
        <div className="sidebar-note">
          <span className="live-dot" />
          <p>Навчальний простір</p>
          <span>
            The Space Devs API<br />
            ll.thespacedevs.com
          </span>
        </div>
        <div className="student">
          <span className="avatar">ОВ</span>
          <div>
            <strong>{info.student}</strong>
            <span>
              {info.group} · варіант {info.variant}
            </span>
          </div>
        </div>
      </aside>
      <main id="overview">
        <header className="topbar">
          <span>
            Робочий простір <span className="breadcrumb-separator">/</span>{' '}
            <strong>Огляд космічних запусків</strong>
          </span>
          <span className="mock-badge live-badge">
            <span className="pulse-dot" />
            ЛР2 · Live Space Devs API
          </span>
        </header>
        <div className="main-content">
          {children}
          <footer className="page-footer">
            <span>Лабораторна робота № 2 · useEffect / API / Container & Presentational / Derived State</span>
            <span>
              {info.group} · Варіант {info.variant}
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
