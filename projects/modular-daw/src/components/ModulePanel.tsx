import { getAllManifests } from '../modules/registry';
import { useGraphStore } from '../store/graph-store';

export function ModulePanel() {
  const addModule = useGraphStore(s => s.addModule);
  const manifests = getAllManifests().filter(m => !m.singleton);

  return (
    <div className="daw-module-panel">
      <h3 className="daw-module-panel__title">Add Module</h3>
      <div className="daw-module-panel__list">
        {manifests.map(m => (
          <button
            key={m.type}
            className="daw-module-panel__btn"
            onClick={() => addModule(m.type, { x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 })}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
