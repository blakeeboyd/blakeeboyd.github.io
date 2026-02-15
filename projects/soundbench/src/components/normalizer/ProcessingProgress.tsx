import type { AudioFileEntry } from '@/types/normalizer';

interface ProcessingProgressProps {
  files: AudioFileEntry[];
  onCancel?: () => void;
}

export function ProcessingProgress({ files, onCancel }: ProcessingProgressProps) {
  const processing = files.filter(f => f.status === 'processing' || f.status === 'decoding');
  const done = files.filter(f => f.status === 'done').length;
  const total = files.filter(f => f.status !== 'error').length;

  if (processing.length === 0 && done === 0) return null;

  const currentFile = processing[0];
  const isMultiFile = total > 1;

  // For multi-file: weighted progress across all files
  const overallPercent = isMultiFile && total > 0
    ? Math.round(((done + (currentFile ? currentFile.progress / 100 : 0)) / total) * 100)
    : (currentFile ? currentFile.progress : 100);

  return (
    <div className="norm-progress">
      <div className="norm-progress__bar-track">
        <div
          className="norm-progress__bar-fill"
          style={{ width: `${overallPercent}%` }}
        />
      </div>
      <div className="norm-progress__footer">
        <div className="norm-progress__info">
          {currentFile ? (
            <span>
              {isMultiFile && <span className="norm-progress__batch">File {done + 1} of {total} — </span>}
              Processing: {currentFile.name} ({currentFile.progress}%)
            </span>
          ) : (
            <span>{done}/{total} files processed</span>
          )}
        </div>
        {onCancel && (
          <button className="norm-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
