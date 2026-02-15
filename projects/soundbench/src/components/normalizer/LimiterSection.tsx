import type { LimiterSettings, LimitType, BatchLimitMode } from '@/types/normalizer';
import { NumericInput } from './NumericInput';

interface LimiterSectionProps {
  settings: LimiterSettings;
  onChange: (patch: Partial<LimiterSettings>) => void;
  fileCount: number;
}

const LIMIT_TYPES: { value: LimitType; label: string }[] = [
  { value: 'peak', label: 'Peak' },
  { value: 'true-peak', label: 'True Peak' },
];

const BATCH_LIMIT_MODES: { value: BatchLimitMode; label: string }[] = [
  { value: 'each', label: 'Each separately' },
  { value: 'together', label: 'Linked (preserve relative levels)' },
];

export function LimiterSection({ settings, onChange, fileCount }: LimiterSectionProps) {
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
            <label className="norm-field__label" data-tooltip="True peak detects intersample peaks via oversampling">Type</label>
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
            <label className="norm-field__label" data-tooltip="Maximum allowed peak level">Ceiling</label>
            <div className="norm-field__input-group">
              <NumericInput
                className="norm-field__input"
                value={settings.ceiling}
                fallback={-1}
                step={0.1}
                max={0}
                onChange={(v) => onChange({ ceiling: v })}
              />
              <span className="norm-field__unit">dB</span>
            </div>
          </div>

          {fileCount > 1 && (
            <div className="norm-field">
              <label className="norm-field__label" data-tooltip="Linked mode preserves relative loudness between files">Batch Mode</label>
              <select
                className="norm-field__select"
                value={settings.batchMode}
                onChange={(e) => onChange({ batchMode: e.target.value as BatchLimitMode })}
              >
                {BATCH_LIMIT_MODES.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </fieldset>
  );
}
