import type { LimiterSettings, LimitType } from '@/types/normalizer';

interface LimiterSectionProps {
  settings: LimiterSettings;
  onChange: (patch: Partial<LimiterSettings>) => void;
}

const LIMIT_TYPES: { value: LimitType; label: string }[] = [
  { value: 'peak', label: 'Peak' },
  { value: 'true-peak', label: 'True Peak' },
];

export function LimiterSection({ settings, onChange }: LimiterSectionProps) {
  return (
    <fieldset className="norm-section">
      <legend className="norm-section__legend">
        <label className="norm-section__toggle">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
          />
          Brickwall Limit
        </label>
      </legend>

      {settings.enabled && (
        <div className="norm-section__body">
          <div className="norm-field">
            <label className="norm-field__label">Type</label>
            <select
              className="norm-field__select"
              value={settings.type}
              onChange={(e) => onChange({ type: e.target.value as LimitType })}
            >
              {LIMIT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="norm-field">
            <label className="norm-field__label">Ceiling</label>
            <div className="norm-field__input-group">
              <input
                type="number"
                className="norm-field__input"
                value={settings.ceiling}
                step={0.1}
                max={0}
                onChange={(e) => onChange({ ceiling: parseFloat(e.target.value) || 0 })}
              />
              <span className="norm-field__unit">dB</span>
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
}
