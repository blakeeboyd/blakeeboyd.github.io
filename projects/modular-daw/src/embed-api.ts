import React from 'react';
import ReactDOM from 'react-dom/client';
import { clearRegistry } from './modules/registry';
import { registerAllModules, registerModules } from './modules';
import { EmbedApp } from './EmbedApp';
import type { PatchDef } from './EmbedApp';
import './styles/index.css';

export type { PatchDef, PatchNodeDef, PatchEdgeDef } from './EmbedApp';

export interface CreateDawInstanceOptions {
  /** CSS selector string or HTMLElement to mount into */
  container: string | HTMLElement;
  /** Module types to register. If omitted, all modules are registered. */
  modules?: string[];
  /** Title displayed above the canvas */
  title?: string;
  /** Subtitle displayed below the title */
  subtitle?: string;
  /** Pre-wired graph to load on mount */
  initialPatch?: PatchDef;
}

export function createDawInstance(options: CreateDawInstanceOptions): { unmount: () => void } {
  const el = typeof options.container === 'string'
    ? document.querySelector(options.container)
    : options.container;

  if (!el) throw new Error(`Container not found: ${options.container}`);

  // Clear and selectively register modules
  clearRegistry();

  if (options.modules) {
    // Always include master-output
    const types = options.modules.includes('master-output')
      ? options.modules
      : [...options.modules, 'master-output'];
    registerModules(types);
  } else {
    registerAllModules();
  }

  const root = ReactDOM.createRoot(el);
  root.render(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(EmbedApp, {
        title: options.title,
        subtitle: options.subtitle,
        initialPatch: options.initialPatch,
        allowedModules: options.modules,
      }),
    ),
  );

  return {
    unmount() {
      root.unmount();
    },
  };
}
