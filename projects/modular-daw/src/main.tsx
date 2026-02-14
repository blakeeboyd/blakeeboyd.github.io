import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { registerAllModules } from './modules';
import './styles/index.css';

// Re-export embed API for use on other pages
export { createDawInstance } from './embed-api';
export type { PatchDef, PatchNodeDef, PatchEdgeDef, CreateDawInstanceOptions } from './embed-api';

// Auto-mount for standalone DAW page (only when #root exists)
const rootEl = document.getElementById('root');
if (rootEl) {
  registerAllModules();
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
