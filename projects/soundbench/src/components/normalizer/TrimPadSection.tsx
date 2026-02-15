import type { TrimFadeSettings, FadeCurve } from '@/types/normalizer';
import { NumericInput } from './NumericInput';

interface TrimPadSectionProps {
  settings: TrimFadeSettings;
  onChange: (patch: Partial<TrimFadeSettings>) => void;
}

const FADE_CURVES: { value: FadeCurve; label: string }[] = [
  { value: 'linear', label: 'Linear' },
  { value: 'equal-power', label: 'Equal Power' },
  { value: 'logarithmic', label: 'Logarithmic' },
  { value: 's-curve', label: 'S-Curve' },
];

export function TrimPadSection({ settings, onChange }: TrimPadSectionProps) {
  const hasTrim = settings.trimStart || settings.trimEnd;
  const hasPad = settings.padStartMs > 0 || settings.padEndMs > 0;
  const hasFade = settings.fadeInMs > 0 || settings.fadeOutMs > 0;
  const isActive = hasTrim || hasPad || hasFade;

  return (
    <fieldset className="norm-section">
      <legend className="norm-section__legend">
        Trim & Fade{isActive ? '' : ' (off)'}
      </legend>

      <div className="norm-section__body">
        {/* Trim */}
        <div className="norm-field norm-field--inline">
          <label className="norm-section__toggle">
            <input
              type="checkbox"
              checked={settings.trimStart}
              onChange={(e) => onChange({ trimStart: e.target.checked })}
            />
            Trim start
          </label>
          <label className="norm-section__toggle">
            <input
              type="checkbox"
              checked={settings.trimEnd}
              onChange={(e) => onChange({ trimEnd: e.target.checked })}
            />
            Trim end
          </label>
        </div>

        {hasTrim && (
          <div className="norm-field">
            <label className="norm-field__label" data-tooltip="Audio below this level is considered silence">Threshold</label>
            <div className="norm-field__input-group">
              <NumericInput
                className="norm-field__input"
                value={settings.trimThresholdDb}
                fallback={-60}
                step={1}
                min={-96}
                max={0}
                onChange={(v) => onChange({ trimThresholdDb: v })}
              />
              <span className="norm-field__unit">dBFS</span>
            </div>
          </div>
        )}

        {/* Pad */}
        <div className="norm-field">
          <label className="norm-field__label">Pad Start</label>
          <div className="norm-field__input-group">
            <NumericInput
              className="norm-field__input"
              value={settings.padStartMs}
              fallback={0}
              step={10}
              min={0}
              onChange={(v) => onChange({ padStartMs: v })}
            />
            <span className="norm-field__unit">ms</span>
          </div>
        </div>

        <div className="norm-field">
          <label className="norm-field__label">Pad End</label>
          <div className="norm-field__input-group">
            <NumericInput
              className="norm-field__input"
              value={settings.padEndMs}
              fallback={0}
              step={10}
              min={0}
              onChange={(v) => onChange({ padEndMs: v })}
            />
            <span className="norm-field__unit">ms</span>
          </div>
        </div>

        {/* Fade */}
        <div className="norm-field">
          <label className="norm-field__label">Fade In</label>
          <div className="norm-field__input-group">
            <NumericInput
              className="norm-field__input"
              value={settings.fadeInMs}
              fallback={0}
              step={10}
              min={0}
              onChange={(v) => onChange({ fadeInMs: v })}
            />
            <span className="norm-field__unit">ms</span>
          </div>
        </div>

        <div className="norm-field">
          <label className="norm-field__label">Fade Out</label>
          <div className="norm-field__input-group">
            <NumericInput
              className="norm-field__input"
              value={settings.fadeOutMs}
              fallback={0}
              step={10}
              min={0}
              onChange={(v) => onChange({ fadeOutMs: v })}
            />
            <span className="norm-field__unit">ms</span>
          </div>
        </div>

        {hasFade && (
          <div className="norm-field">
            <label className="norm-field__label">Curve</label>
            <select
              className="norm-field__select"
              value={settings.fadeCurve}
              onChange={(e) => onChange({ fadeCurve: e.target.value as FadeCurve })}
            >
              {FADE_CURVES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </fieldset>
  );
}
