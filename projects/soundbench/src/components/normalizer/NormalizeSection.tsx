import type { NormalizeSettings, NormalizationType, NormalizeCondition, BatchNormMode } from '@/types/normalizer';
import { NumericInput } from './NumericInput';

interface NormalizeSectionProps {
  settings: NormalizeSettings;
  onChange: (patch: Partial<NormalizeSettings>) => void;
  fileCount: number;
}

const NORM_TYPES: { value: NormalizationType; label: string }[] = [
  { value: 'lufs-i', label: 'LUFS-I (Integrated)' },
  { value: 'lufs-m-max', label: 'LUFS-M Max (Momentary)' },
  { value: 'lufs-s-max', label: 'LUFS-S Max (Short-term)' },
  { value: 'peak', label: 'Peak' },
  { value: 'true-peak', label: 'True Peak' },
  { value: 'rms-i', label: 'RMS-I' },
];

const CONDITIONS: { value: NormalizeCondition; label: string }[] = [
  { value: 'always', label: 'Always' },
  { value: 'too-loud', label: 'Only if too loud' },
  { value: 'too-quiet', label: 'Only if too quiet' },
];

const BATCH_NORM_MODES: { value: BatchNormMode; label: string }[] = [
  { value: 'each', label: 'Each separately' },
  { value: 'loudest', label: 'To loudest (album gain)' },
  { value: 'album', label: 'Combined program' },
];

function getUnit(type: NormalizationType): string {
  return type === 'lufs-i' || type === 'lufs-m-max' || type === 'lufs-s-max' ? 'LUFS' : 'dB';
}

function getDefaultTarget(type: NormalizationType): number {
  switch (type) {
    case 'lufs-i': return -14;
    case 'lufs-m-max': return -11;
    case 'lufs-s-max': return -14;
    case 'rms-i': return -18;
    case 'peak': return -1;
    case 'true-peak': return -1;
    default: return -14;
  }
}

export function NormalizeSection({ settings, onChange, fileCount }: NormalizeSectionProps) {
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
            <label className="norm-field__label" data-tooltip="Measurement method for loudness analysis">Type</label>
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
            <label className="norm-field__label" data-tooltip="Target loudness or peak level">Target</label>
            <div className="norm-field__input-group">
              <NumericInput
                className="norm-field__input"
                value={settings.targetValue}
                fallback={getDefaultTarget(settings.type)}
                step={0.1}
                onChange={(v) => onChange({ targetValue: v })}
              />
              <span className="norm-field__unit">{getUnit(settings.type)}</span>
            </div>
          </div>

          <div className="norm-field">
            <label className="norm-field__label" data-tooltip="When to apply normalization">Condition</label>
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

          {fileCount > 1 && (
            <div className="norm-field">
              <label className="norm-field__label" data-tooltip="How to calculate gain across multiple files">Batch Mode</label>
              <select
                className="norm-field__select"
                value={settings.batchMode}
                onChange={(e) => onChange({ batchMode: e.target.value as BatchNormMode })}
              >
                {BATCH_NORM_MODES.map(m => (
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
