import type { AudioFileEntry } from '@/types/normalizer';
import { FileRow } from './FileRow';

interface FileListProps {
  files: AudioFileEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function FileList({ files, onRemove, onClear }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="norm-file-list">
      <div className="norm-file-list__header">
        <span className="norm-file-list__count">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </span>
        <button className="norm-file-list__clear" onClick={onClear}>
          Clear all
        </button>
      </div>
      <div className="norm-file-list__items">
        {files.map(entry => (
          <FileRow
            key={entry.id}
            entry={entry}
            onRemove={() => onRemove(entry.id)}
          />
        ))}
      </div>
    </div>
  );
}
