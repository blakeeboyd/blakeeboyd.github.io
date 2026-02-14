import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './pages/HomePage';
import { PatchSheetPage } from './pages/PatchSheetPage';
import { StagePlotPage } from './pages/StagePlotPage';
import { RunOfShowPage } from './pages/RunOfShowPage';
import './styles/index.css';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'patch-sheets', element: <PatchSheetPage /> },
      { path: 'patch-sheets/:id', element: <PatchSheetPage /> },
      { path: 'stage-plots', element: <StagePlotPage /> },
      { path: 'stage-plots/:id', element: <StagePlotPage /> },
      { path: 'run-of-show', element: <RunOfShowPage /> },
      { path: 'run-of-show/:id', element: <RunOfShowPage /> },
    ],
  },
]);

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
