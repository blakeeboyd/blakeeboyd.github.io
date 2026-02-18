import { useRef } from 'react';
import { useStagePlotStore } from '@/store/stage-plot-store';
import { ELEMENT_TYPES, ELEMENT_CATEGORIES } from './element-types';

export function ElementPalette() {
  const addElement = useStagePlotStore(s => s.addElement);
  const backgroundImage = useStagePlotStore(s => s.backgroundImage);
  const backgroundOpacity = useStagePlotStore(s => s.backgroundOpacity);
  const setBackground = useStagePlotStore(s => s.setBackground);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAdd = (type: string) => {
    addElement(type, { x: 100, y: 100 });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBackground(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <>
      {ELEMENT_CATEGORIES.map(cat => {
        const items = ELEMENT_TYPES.filter(e => e.category === cat.key);
        if (items.length === 0) return null;
        return (
          <div key={cat.key} className="advc-stage-panel__section">
            <h3 className="advc-stage-panel__title">{cat.label}</h3>
            <div className="advc-palette">
              {items.map(el => (
                <button
                  key={el.type}
                  className="advc-palette__item"
                  onClick={() => handleAdd(el.type)}
                  title={el.name}
                >
                  <span className="advc-palette__item-icon">{el.icon}</span>
                  <span className="advc-palette__item-name">{el.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div className="advc-stage-panel__section">
        <h3 className="advc-stage-panel__title">Background</h3>
        <div className="advc-bg-upload">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {backgroundImage ? (
            <>
              <img
                src={backgroundImage}
                alt="Background preview"
                style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4 }}
              />
              <div className="advc-props__row">
                <span className="advc-props__label">Opacity</span>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={backgroundOpacity}
                  onChange={(e) => setBackground(backgroundImage, Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--advc-text-tertiary)', minWidth: 28 }}>
                  {Math.round(backgroundOpacity * 100)}%
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="advc-btn advc-btn--sm" onClick={() => fileRef.current?.click()}>Replace</button>
                <button className="advc-btn advc-btn--sm advc-btn--danger" onClick={() => setBackground(null)}>Remove</button>
              </div>
            </>
          ) : (
            <div className="advc-bg-upload__drop" onClick={() => fileRef.current?.click()}>
              Click to upload background image
            </div>
          )}
        </div>
      </div>
    </>
  );
}
