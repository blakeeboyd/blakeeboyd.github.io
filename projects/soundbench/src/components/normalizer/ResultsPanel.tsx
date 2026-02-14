import type { AudioFileEntry } from '@/types/normalizer';

interface ResultsPanelProps {
  files: AudioFileEntry[];
  filenameSuffix: string;
}

function formatDb(val: number | undefined): string {
  if (val === undefined || !isFinite(val)) return '—';
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)}`;
}

function formatLufs(val: number | undefined): string {
  if (val === undefined || !isFinite(val)) return '—';
  return val.toFixed(1);
}

function downloadWav(buffer: ArrayBuffer, filename: string): void {
  const blob = new Blob([buffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function getOutputFilename(name: string, suffix: string): string {
  const lastDot = name.lastIndexOf('.');
  const base = lastDot > 0 ? name.substring(0, lastDot) : name;
  return `${base}${suffix}.wav`;
}

export function ResultsPanel({ files, filenameSuffix }: ResultsPanelProps) {
  const doneFiles = files.filter(f => f.status === 'done' && f.outputBuffer);

  if (doneFiles.length === 0) return null;

  return (
    <div className="norm-results">
      <h3 className="norm-results__title">Results</h3>

      <table className="norm-results__table">
        <thead>
          <tr>
            <th>File</th>
            <th colSpan={2}>LUFS-I</th>
            <th colSpan={2}>Peak (dB)</th>
            <th>Gain</th>
            <th></th>
          </tr>
          <tr className="norm-results__subheader">
            <th></th>
            <th>Before</th>
            <th>After</th>
            <th>Before</th>
            <th>After</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {doneFiles.map(f => (
            <tr key={f.id}>
              <td className="norm-results__name" title={f.name}>{f.name}</td>
              <td className="norm-results__value">{formatLufs(f.inputMeasurements?.lufsI)}</td>
              <td className="norm-results__value">{formatLufs(f.outputMeasurements?.lufsI)}</td>
              <td className="norm-results__value">{formatDb(f.inputMeasurements?.peakDb)}</td>
              <td className="norm-results__value">{formatDb(f.outputMeasurements?.peakDb)}</td>
              <td className="norm-results__value">{formatDb(f.appliedGainDb)}</td>
              <td>
                <button
                  className="norm-results__download"
                  onClick={() => downloadWav(f.outputBuffer!, getOutputFilename(f.name, filenameSuffix))}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {doneFiles.length > 1 && (
        <button
          className="norm-results__download-all"
          onClick={() => {
            doneFiles.forEach(f => {
              downloadWav(f.outputBuffer!, getOutputFilename(f.name, filenameSuffix));
            });
          }}
        >
          Download All
        </button>
      )}
    </div>
  );
}
