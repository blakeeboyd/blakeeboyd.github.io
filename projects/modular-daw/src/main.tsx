import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { registerAllModules } from './modules';
import './styles/index.css';

// Register module types before rendering
registerAllModules();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
