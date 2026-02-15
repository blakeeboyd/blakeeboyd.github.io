import type { AudioFileEntry } from '@/types/normalizer';
import { createZip } from '@/lib/normalizer/zip';

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

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadWav(buffer: ArrayBuffer, filename: string): void {
  downloadBlob(new Blob([buffer], { type: 'audio/wav' }), filename);
}

function getBaseName(name: string): string {
  const lastDot = name.lastIndexOf('.');
  return lastDot > 0 ? name.substring(0, lastDot) : name;
}

function getOutputFilename(name: string, suffix: string): string {
  return `${getBaseName(name)}${suffix}.wav`;
}

export function ResultsPanel({ files, filenameSuffix }: ResultsPanelProps) {
  const doneFiles = files.filter(f => f.status === 'done' && f.outputBuffer);

  if (doneFiles.length === 0) return null;

  const hasSplitFiles = doneFiles.some(f => f.outputBufferL || f.outputBufferR);

  function handleDownloadZip(): void {
    const entries: { name: string; data: ArrayBuffer }[] = [];

    for (const f of doneFiles) {
      const base = getBaseName(f.name);

      entries.push({
        name: getOutputFilename(f.name, filenameSuffix),
        data: f.outputBuffer!,
      });

      if (f.outputBufferL) {
        entries.push({ name: `${base}${filenameSuffix}_L.wav`, data: f.outputBufferL });
      }
      if (f.outputBufferR) {
        entries.push({ name: `${base}${filenameSuffix}_R.wav`, data: f.outputBufferR });
      }
    }

    const zipBuffer = createZip(entries);
    downloadBlob(new Blob([zipBuffer], { type: 'application/zip' }), 'normalized.zip');
  }

  return (
    <div className="norm-results">
      <h3 className="norm-results__title">Results</h3>

      <div className="norm-results__table-wrap">
      <table className="norm-results__table">
        <thead>
          <tr>
            <th>File</th>
            <th colSpan={2}>LUFS-I</th>
            <th colSpan={2}>LUFS-M</th>
            <th colSpan={2}>LUFS-S</th>
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
              <td className="norm-results__value">{formatLufs(f.inputMeasurements?.lufsMMax)}</td>
              <td className="norm-results__value">{formatLufs(f.outputMeasurements?.lufsMMax)}</td>
              <td className="norm-results__value">{formatLufs(f.inputMeasurements?.lufsSMax)}</td>
              <td className="norm-results__value">{formatLufs(f.outputMeasurements?.lufsSMax)}</td>
              <td className="norm-results__value">{formatDb(f.inputMeasurements?.peakDb)}</td>
              <td className="norm-results__value">{formatDb(f.outputMeasurements?.peakDb)}</td>
              <td className="norm-results__value">{formatDb(f.appliedGainDb)}</td>
              <td>
                <div className="norm-results__download-group">
                  <button
                    className="norm-results__download"
                    onClick={() => downloadWav(f.outputBuffer!, getOutputFilename(f.name, filenameSuffix))}
                  >
                    Download
                  </button>
                  {f.outputBufferL && (
                    <button
                      className="norm-results__download norm-results__download--split"
                      onClick={() => downloadWav(f.outputBufferL!, `${getBaseName(f.name)}${filenameSuffix}_L.wav`)}
                    >
                      L
                    </button>
                  )}
                  {f.outputBufferR && (
                    <button
                      className="norm-results__download norm-results__download--split"
                      onClick={() => downloadWav(f.outputBufferR!, `${getBaseName(f.name)}${filenameSuffix}_R.wav`)}
                    >
                      R
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {doneFiles.length > 1 && (
        <div className="norm-results__actions">
          <button
            className="norm-results__download-all"
            onClick={() => {
              for (const f of doneFiles) {
                downloadWav(f.outputBuffer!, getOutputFilename(f.name, filenameSuffix));
                if (f.outputBufferL) {
                  downloadWav(f.outputBufferL, `${getBaseName(f.name)}${filenameSuffix}_L.wav`);
                }
                if (f.outputBufferR) {
                  downloadWav(f.outputBufferR, `${getBaseName(f.name)}${filenameSuffix}_R.wav`);
                }
              }
            }}
          >
            Download All
          </button>
          <button
            className="norm-results__download-zip"
            onClick={handleDownloadZip}
          >
            Download ZIP
          </button>
        </div>
      )}

      {doneFiles.length === 1 && hasSplitFiles && (
        <div className="norm-results__actions">
          <button
            className="norm-results__download-zip"
            onClick={handleDownloadZip}
          >
            Download ZIP
          </button>
        </div>
      )}
    </div>
  );
}
