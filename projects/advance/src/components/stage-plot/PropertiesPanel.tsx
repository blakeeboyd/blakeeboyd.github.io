import { useStagePlotStore } from '@/store/stage-plot-store';

export function PropertiesPanel() {
  const elements = useStagePlotStore(s => s.elements);
  const selectedElementId = useStagePlotStore(s => s.selectedElementId);
  const updateElement = useStagePlotStore(s => s.updateElement);
  const removeElement = useStagePlotStore(s => s.removeElement);
  const duplicateElement = useStagePlotStore(s => s.duplicateElement);
  const selectElement = useStagePlotStore(s => s.selectElement);

  const el = elements.find(e => e.id === selectedElementId);
  if (!el) return null;

  return (
    <div className="advc-stage-panel__section">
      <h3 className="advc-stage-panel__title">Properties</h3>
      <div className="advc-props">
        <div className="advc-props__row">
          <span className="advc-props__label">Label</span>
          <input
            className="advc-props__input"
            value={el.label}
            onChange={(e) => updateElement(el.id, { label: e.target.value })}
          />
        </div>
        <div className="advc-props__row">
          <span className="advc-props__label">X</span>
          <input
            className="advc-props__input"
            type="number"
            value={Math.round(el.x)}
            onChange={(e) => updateElement(el.id, { x: Number(e.target.value) })}
            style={{ width: 60 }}
          />
          <span className="advc-props__label">Y</span>
          <input
            className="advc-props__input"
            type="number"
            value={Math.round(el.y)}
            onChange={(e) => updateElement(el.id, { y: Number(e.target.value) })}
            style={{ width: 60 }}
          />
        </div>
        <div className="advc-props__row">
          <span className="advc-props__label">W</span>
          <input
            className="advc-props__input"
            type="number"
            value={el.width}
            onChange={(e) => updateElement(el.id, { width: Number(e.target.value) })}
            style={{ width: 60 }}
          />
          <span className="advc-props__label">H</span>
          <input
            className="advc-props__input"
            type="number"
            value={el.height}
            onChange={(e) => updateElement(el.id, { height: Number(e.target.value) })}
            style={{ width: 60 }}
          />
        </div>
        <div className="advc-props__row">
          <span className="advc-props__label">Rotate</span>
          <input
            className="advc-props__input"
            type="number"
            min={0}
            max={359}
            value={el.rotation}
            onChange={(e) => updateElement(el.id, { rotation: Number(e.target.value) })}
            style={{ width: 60 }}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--advc-text-tertiary)' }}>deg</span>
        </div>
        <div className="advc-props__row">
          <span className="advc-props__label">Color</span>
          <input
            type="color"
            value={el.color}
            onChange={(e) => updateElement(el.id, { color: e.target.value })}
            style={{ width: 32, height: 24, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
          />
        </div>
        <div className="advc-props__row">
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--advc-text-secondary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={el.labelVisible}
              onChange={(e) => updateElement(el.id, { labelVisible: e.target.checked })}
              style={{ accentColor: 'var(--advc-accent)' }}
            />
            Show label
          </label>
        </div>
        <div className="advc-props__row" style={{ marginTop: 8, gap: 6 }}>
          <button className="advc-btn advc-btn--sm" onClick={() => duplicateElement(el.id)}>Duplicate</button>
          <button className="advc-btn advc-btn--sm advc-btn--danger" onClick={() => { removeElement(el.id); selectElement(null); }}>Delete</button>
        </div>
      </div>
    </div>
  );
}
