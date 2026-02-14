import { useState, useRef, useEffect, useCallback } from 'react';
import { getAllManifests } from '../modules/registry';
import { useGraphStore } from '../store/graph-store';
import type { ModuleManifest } from '../types/modules';

const CATEGORY_ORDER = ['io', 'generator', 'effect', 'routing', 'utility', 'atomic'] as const;

const CATEGORY_LABELS: Record<string, string> = {
  io: 'I/O',
  generator: 'Generators',
  effect: 'Effects',
  routing: 'Routing',
  utility: 'Utility',
  atomic: 'Atomic',
};

const CATEGORY_COLORS: Record<string, string> = {
  io: 'var(--daw-cat-io)',
  generator: 'var(--daw-cat-source)',
  effect: 'var(--daw-cat-effect)',
  routing: 'var(--daw-cat-routing)',
  utility: 'var(--daw-cat-utility)',
  atomic: 'var(--daw-cat-atomic)',
};

export function ModulePanel({ allowedModules }: { allowedModules?: string[] }) {
  const addModule = useGraphStore(s => s.addModule);
  const manifests = getAllManifests().filter(m =>
    !m.singleton && !m.internal &&
    (!allowedModules || allowedModules.includes(m.type))
  );

  const [openCat, setOpenCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleCategoryClick = useCallback((cat: string) => {
    setOpenCat(prev => (prev === cat ? null : cat));
  }, []);

  const handleAddModule = useCallback((type: string) => {
    addModule(type, { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 });
    setOpenCat(null);
    setSearchQuery('');
  }, [addModule]);

  // Close popover on click outside
  useEffect(() => {
    if (!openCat && !searchQuery) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpenCat(null);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openCat, searchQuery]);

  // Close on Escape
  useEffect(() => {
    if (!openCat && !searchQuery) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenCat(null);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openCat, searchQuery]);

  // Group by category
  const grouped = new Map<string, ModuleManifest[]>();
  for (const m of manifests) {
    const list = grouped.get(m.category) ?? [];
    list.push(m);
    grouped.set(m.category, list);
  }

  // Filtered search results
  const query = searchQuery.toLowerCase().trim();
  const searchResults = query
    ? manifests.filter(m => m.label.toLowerCase().includes(query))
    : [];

  return (
    <div className="daw-module-panel" ref={panelRef}>
      <div className="daw-module-panel__categories">
        <input
          ref={searchRef}
          className="daw-module-panel__search nodrag"
          type="text"
          placeholder="Search modules..."
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setOpenCat(null); }}
        />
        {query ? (
          // Search results mode: flat list with category dots
          searchResults.length > 0 ? (
            <div className="daw-module-panel__list">
              {searchResults.map(m => (
                <button
                  key={m.type}
                  className="daw-module-panel__btn"
                  onClick={() => handleAddModule(m.type)}
                >
                  <span
                    className="daw-module-panel__category-dot"
                    style={{ background: CATEGORY_COLORS[m.category], display: 'inline-block', marginRight: 6 }}
                  />
                  {m.label}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: '6px 8px', fontSize: '0.7rem', color: 'var(--daw-text-tertiary)' }}>
              No modules found
            </div>
          )
        ) : (
          // Category accordion mode
          CATEGORY_ORDER.map(cat => {
            const modules = grouped.get(cat);
            if (!modules || modules.length === 0) return null;
            const isOpen = openCat === cat;
            return (
              <div key={cat} className="daw-module-panel__cat-wrapper">
                <button
                  className={`daw-module-panel__cat-btn ${isOpen ? 'daw-module-panel__cat-btn--active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                  aria-expanded={isOpen}
                  title={CATEGORY_LABELS[cat]}
                >
                  <span
                    className="daw-module-panel__category-dot"
                    style={{ background: CATEGORY_COLORS[cat] }}
                  />
                  {CATEGORY_LABELS[cat]}
                </button>
                {isOpen && (
                  <div className="daw-module-panel__popover">
                    <div className="daw-module-panel__popover-header">
                      <span
                        className="daw-module-panel__category-dot"
                        style={{ background: CATEGORY_COLORS[cat] }}
                      />
                      {CATEGORY_LABELS[cat]}
                    </div>
                    <div className="daw-module-panel__list">
                      {modules.map(m => (
                        <button
                          key={m.type}
                          className="daw-module-panel__btn"
                          onClick={() => handleAddModule(m.type)}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
