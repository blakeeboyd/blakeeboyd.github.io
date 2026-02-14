import type { OutputSettings, BitDepth } from '@/types/normalizer';

interface OutputSectionProps {
  settings: OutputSettings;
  onChange: (patch: Partial<OutputSettings>) => void;
}

const BIT_DEPTHS: { value: BitDepth; label: string }[] = [
  { value: 16, label: '16-bit (CD quality)' },
  { value: 24, label: '24-bit' },
  { value: 32, label: '32-bit float' },
];

export function OutputSection({ settings, onChange }: OutputSectionProps) {
  return (
    <fieldset className="norm-section">
      <legend className="norm-section__legend">Output</legend>

      <div className="norm-section__body">
        <div className="norm-field">
          <label className="norm-field__label">Bit Depth</label>
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
      </div>
    </fieldset>
  );
}
