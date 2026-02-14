import { NavLink } from 'react-router-dom';

export function AppHeader() {
  return (
    <header className="adv-header">
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <h1 className="adv-header__title">Advance</h1>
      </NavLink>
      <nav className="adv-header__nav">
        <NavLink
          to="/patch-sheets"
          className={({ isActive }) =>
            `adv-header__tab${isActive ? ' adv-header__tab--active' : ''}`
          }
        >
          Patch Sheets
        </NavLink>
        <NavLink
          to="/stage-plots"
          className={({ isActive }) =>
            `adv-header__tab${isActive ? ' adv-header__tab--active' : ''}`
          }
        >
          Stage Plots
        </NavLink>
        <NavLink
          to="/run-of-show"
          className={({ isActive }) =>
            `adv-header__tab${isActive ? ' adv-header__tab--active' : ''}`
          }
        >
          Run of Show
        </NavLink>
        <a href="guide.html" className="adv-header__tab adv-header__guide" target="_blank" rel="noopener">
          Guide
        </a>
      </nav>
    </header>
  );
}
