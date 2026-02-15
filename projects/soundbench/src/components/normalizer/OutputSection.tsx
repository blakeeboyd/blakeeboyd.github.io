import type { OutputSettings, BitDepth, MonoMode } from '@/types/normalizer';

interface OutputSectionProps {
  settings: OutputSettings;
  onChange: (patch: Partial<OutputSettings>) => void;
}

const BIT_DEPTHS: { value: BitDepth; label: string }[] = [
  { value: 16, label: '16-bit (CD quality)' },
  { value: 24, label: '24-bit' },
  { value: 32, label: '32-bit float' },
];

const MONO_MODES: { value: MonoMode; label: string }[] = [
  { value: 'off', label: 'Keep original' },
  { value: 'downmix', label: 'Downmix to mono' },
  { value: 'split', label: 'Split L/R to separate files' },
];

export function OutputSection({ settings, onChange }: OutputSectionProps) {
  return (
    <fieldset className="norm-section">
      <legend className="norm-section__legend">Output</legend>

      <div className="norm-section__body">
        <div className="norm-field">
          <label className="norm-field__label" data-tooltip="Higher bit depth = larger file, more dynamic range">Bit Depth</label>
          <select
            className="norm-field__select"
            value={settings.bitDepth}
            onChange={(e) => onChange({ bitDepth: parseInt(e.target.value) as BitDepth })}
          >
            {BIT_DEPTHS.map(b => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>

        <div className="norm-field">
          <label className="norm-field__label">Filename Suffix</label>
          <input
            type="text"
            className="norm-field__input"
            value={settings.filenameSuffix}
            placeholder="_normalized"
            onChange={(e) => onChange({ filenameSuffix: e.target.value })}
          />
        </div>

        <div className="norm-field">
          <label className="norm-field__label" data-tooltip="Downmix combines channels; Split exports L/R separately">Channel Output</label>
          <select
            className="norm-field__select"
            value={settings.monoMode}
            onChange={(e) => onChange({ monoMode: e.target.value as MonoMode })}
          >
            {MONO_MODES.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  );
}
