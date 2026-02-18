import { NavLink, useLocation } from 'react-router-dom';

export function AppHeader() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="advc-header">
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <h1 className="advc-header__title">Advance</h1>
      </NavLink>
      <nav className="advc-header__nav">
        <NavLink
          to="/"
          end
          className={`advc-header__home${isHome ? ' advc-header__home--active' : ''}`}
          aria-label="All tools"
          title="All tools"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </NavLink>
        <NavLink
          to="/patch-sheets"
          className={({ isActive }) =>
            `advc-header__tab${isActive ? ' advc-header__tab--active' : ''}`
          }
        >
          Patch Sheets
        </NavLink>
        <NavLink
          to="/stage-plots"
          className={({ isActive }) =>
            `advc-header__tab${isActive ? ' advc-header__tab--active' : ''}`
          }
        >
          Stage Plots
        </NavLink>
        <NavLink
          to="/run-of-show"
          className={({ isActive }) =>
            `advc-header__tab${isActive ? ' advc-header__tab--active' : ''}`
          }
        >
          Run of Show
        </NavLink>
        <a href="guide.html" className="advc-header__tab advc-header__guide" target="_blank" rel="noopener">
          Guide
        </a>
      </nav>
    </header>
  );
}
