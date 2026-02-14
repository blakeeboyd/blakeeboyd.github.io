import type { NormalizeSettings, NormalizationType, NormalizeCondition } from '@/types/normalizer';

interface NormalizeSectionProps {
  settings: NormalizeSettings;
  onChange: (patch: Partial<NormalizeSettings>) => void;
}

const NORM_TYPES: { value: NormalizationType; label: string }[] = [
  { value: 'lufs-i', label: 'LUFS-I (Integrated)' },
  { value: 'peak', label: 'Peak' },
  { value: 'true-peak', label: 'True Peak' },
  { value: 'rms-i', label: 'RMS-I' },
];

const CONDITIONS: { value: NormalizeCondition; label: string }[] = [
  { value: 'always', label: 'Always' },
  { value: 'too-loud', label: 'Only if too loud' },
  { value: 'too-quiet', label: 'Only if too quiet' },
];

function getUnit(type: NormalizationType): string {
  return type === 'lufs-i' ? 'LUFS' : 'dB';
}

function getDefaultTarget(type: NormalizationType): number {
  switch (type) {
    case 'lufs-i': return -14;
    case 'rms-i': return -18;
    case 'peak': return -1;
    case 'true-peak': return -1;
    default: return -14;
  }
}

export function NormalizeSection({ settings, onChange }: NormalizeSectionProps) {
  return (
    <fieldset className="norm-section">
      <legend className="norm-section__legend">
        <label className="norm-section__toggle">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
          />
          Normalize
        </label>
      </legend>

      {settings.enabled && (
        <div className="norm-section__body">
          <div className="norm-field">
            <label className="norm-field__label">Type</label>
            <select
              className="norm-field__select"
              value={settings.type}
              onChange={(e) => {
                const type = e.target.value as NormalizationType;
                onChange({ type, targetValue: getDefaultTarget(type) });
              }}
            >
              {NORM_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="norm-field">
            <label className="norm-field__label">Target</label>
            <div className="norm-field__input-group">
              <input
                type="number"
                className="norm-field__input"
                value={settings.targetValue}
                step={0.1}
                onChange={(e) => onChange({ targetValue: parseFloat(e.target.value) || 0 })}
              />
              <span className="norm-field__unit">{getUnit(settings.type)}</span>
            </div>
          </div>

          <div className="norm-field">
            <label className="norm-field__label">Condition</label>
            <select
              className="norm-field__select"
              value={settings.condition}
              onChange={(e) => onChange({ condition: e.target.value as NormalizeCondition })}
            >
              {CONDITIONS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </fieldset>
  );
}
