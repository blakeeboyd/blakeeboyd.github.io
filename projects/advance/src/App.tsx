import { Outlet } from 'react-router-dom';
import { AppHeader } from './components/layout/AppHeader';

export function App() {
  return (
    <div className="advc-app">
      <AppHeader />
      <Outlet />
    </div>
  );
}
