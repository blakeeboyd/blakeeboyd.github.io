import { useState, useRef, useEffect } from 'react';
import { usePresetStore } from '@/store/preset-store';
import { useNormalizerStore } from '@/store/normalizer-store';
import type { PresetSettings } from '@/types/normalizer';

function isModified(presetSettings: PresetSettings, current: PresetSettings): boolean {
  return JSON.stringify(presetSettings) !== JSON.stringify(current);
}

export function PresetManager() {
  const presets = usePresetStore(s => s.presets);
  const activePresetId = usePresetStore(s => s.activePresetId);
  const loadPreset = usePresetStore(s => s.loadPreset);
  const savePreset = usePresetStore(s => s.savePreset);
  const updatePreset = usePresetStore(s => s.updatePreset);
  const deletePreset = usePresetStore(s => s.deletePreset);

  // Subscribe to normalizer settings to detect modifications
  const normalize = useNormalizerStore(s => s.normalize);
  const trimFade = useNormalizerStore(s => s.trimFade);
  const limiter = useNormalizerStore(s => s.limiter);
  const output = useNormalizerStore(s => s.output);

  const [mode, setMode] = useState<'idle' | 'saving' | 'confirming-delete'>('idle');
  const [saveName, setSaveName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'saving' && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [mode]);

  const activePreset = activePresetId ? presets.find(p => p.id === activePresetId) : null;
  const current = { normalize, trimFade, limiter, output };
  const modified = activePreset ? isModified(activePreset.settings, current) : false;

  const builtInPresets = presets.filter(p => p.builtIn);
  const userPresets = presets.filter(p => !p.builtIn);

  const handleSelect = (value: string) => {
    if (value === '') {
      usePresetStore.setState({ activePresetId: null });
    } else {
      loadPreset(value);
    }
    setMode('idle');
  };

  const handleSave = () => {
    const name = saveName.trim();
    if (!name) {
      setMode('idle');
      return;
    }
    savePreset(name);
    setSaveName('');
    setMode('idle');
  };

  const handleUpdate = () => {
    if (activePresetId) {
      updatePreset(activePresetId);
    }
  };

  const handleDelete = () => {
    if (activePresetId) {
      deletePreset(activePresetId);
    }
    setMode('idle');
  };

  return (
    <div className="norm-presets">
      {mode === 'saving' ? (
        <div className="norm-presets__save-row">
          <input
            ref={nameInputRef}
            className="norm-presets__name-input"
            type="text"
            placeholder="Preset name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') { setSaveName(''); setMode('idle'); }
            }}
            onBlur={handleSave}
          />
        </div>
      ) : mode === 'confirming-delete' ? (
        <div className="norm-presets__confirm">
          <span className="norm-presets__confirm-text">Delete "{activePreset?.name}"?</span>
          <button className="norm-presets__btn norm-presets__btn--delete" onClick={handleDelete}>Yes</button>
          <button className="norm-presets__btn" onClick={() => setMode('idle')}>No</button>
        </div>
      ) : (
        <>
          <select
            className="norm-presets__select"
            value={activePresetId ?? ''}
            onChange={(e) => handleSelect(e.target.value)}
          >
            <option value="">Custom settings</option>
            <optgroup label="Built-in">
              {builtInPresets.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </optgroup>
            {userPresets.length > 0 && (
              <optgroup label="Saved">
                {userPresets.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            )}
          </select>

          <div className="norm-presets__actions">
            {activePreset && !activePreset.builtIn && modified && (
              <button className="norm-presets__btn" onClick={handleUpdate} title="Overwrite preset with current settings">
                Update
              </button>
            )}
            <button className="norm-presets__btn" onClick={() => { setSaveName(''); setMode('saving'); }} title="Save current settings as a new preset">
              Save As
            </button>
            {activePreset && !activePreset.builtIn && (
              <button className="norm-presets__btn norm-presets__btn--delete" onClick={() => setMode('confirming-delete')} title="Delete preset">
                &times;
              </button>
            )}
          </div>

          {activePreset && modified && (
            <span className="norm-presets__modified">(modified)</span>
          )}
        </>
      )}
    </div>
  );
}
