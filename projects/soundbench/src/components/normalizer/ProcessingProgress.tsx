import type { AudioFileEntry } from '@/types/normalizer';

interface ProcessingProgressProps {
  files: AudioFileEntry[];
}

export function ProcessingProgress({ files }: ProcessingProgressProps) {
  const processing = files.filter(f => f.status === 'processing' || f.status === 'decoding');
  const done = files.filter(f => f.status === 'done').length;
  const total = files.length;

  if (processing.length === 0 && done === 0) return null;

  const overallPercent = total > 0 ? Math.round((done / total) * 100) : 0;
  const currentFile = processing[0];

  return (
    <div className="norm-progress">
      <div className="norm-progress__bar-track">
        <div
          className="norm-progress__bar-fill"
          style={{ width: `${currentFile ? currentFile.progress : overallPercent}%` }}
        />
      </div>
      <div className="norm-progress__info">
        {currentFile ? (
          <span>Processing: {currentFile.name} ({currentFile.progress}%)</span>
        ) : (
          <span>{done}/{total} files processed</span>
        )}
      </div>
    </div>
  );
}
