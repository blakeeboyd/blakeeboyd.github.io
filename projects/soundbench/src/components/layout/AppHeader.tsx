import { NavLink } from 'react-router-dom';

export function AppHeader() {
  return (
    <header className="sb-header">
      <NavLink to="/" className="sb-header__title" style={{ textDecoration: 'none' }}>
        SoundBench
      </NavLink>
      <nav className="sb-header__nav">
        <NavLink
          to="/normalizer"
          className={({ isActive }) =>
            `sb-header__tab${isActive ? ' sb-header__tab--active' : ''}`
          }
        >
          Normalizer
        </NavLink>
      </nav>
    </header>
  );
}
