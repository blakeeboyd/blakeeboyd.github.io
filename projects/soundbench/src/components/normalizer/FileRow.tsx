import type { AudioFileEntry } from '@/types/normalizer';

interface FileRowProps {
  entry: AudioFileEntry;
  onRemove: () => void;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDb(val: number | undefined): string {
  if (val === undefined || !isFinite(val)) return '—';
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)} dB`;
}

function formatLufs(val: number | undefined): string {
  if (val === undefined || !isFinite(val)) return '—';
  return `${val.toFixed(1)} LUFS`;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  decoding: 'Decoding...',
  ready: 'Ready',
  processing: 'Processing...',
  done: 'Done',
  error: 'Error',
};

export function FileRow({ entry, onRemove }: FileRowProps) {
  const { name, status, error, sampleRate, channelCount, durationSec, inputMeasurements } = entry;

  return (
    <div className={`norm-file-row norm-file-row--${status}`}>
      <div className="norm-file-row__info">
        <span className="norm-file-row__name" title={name}>{name}</span>
        <span className="norm-file-row__meta">
          {sampleRate && channelCount && durationSec !== undefined ? (
            <>
              {formatDuration(durationSec)} &middot; {channelCount === 1 ? 'Mono' : channelCount === 2 ? 'Stereo' : `${channelCount}ch`} &middot; {(sampleRate / 1000).toFixed(1)}kHz
            </>
          ) : (
            STATUS_LABELS[status] ?? status
          )}
        </span>
        {error && <span className="norm-file-row__error">{error}</span>}
      </div>

      {inputMeasurements && (
        <div className="norm-file-row__measurements">
          <span title="LUFS-I">{formatLufs(inputMeasurements.lufsI)}</span>
          <span title="Peak">{formatDb(inputMeasurements.peakDb)}</span>
        </div>
      )}

      <button
        className="norm-file-row__remove"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        title="Remove file"
      >
        &times;
      </button>
    </div>
  );
}
