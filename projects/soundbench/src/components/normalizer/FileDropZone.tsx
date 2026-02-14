import { useCallback, useRef, useState } from 'react';

interface FileDropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPTED = '.wav,.mp3,.ogg,.flac,.aac,.m4a';
const ACCEPTED_TYPES = ['audio/wav', 'audio/mpeg', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/mp4', 'audio/x-wav', 'audio/wave'];

function isAudioFile(file: File): boolean {
  if (ACCEPTED_TYPES.includes(file.type)) return true;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return ['wav', 'mp3', 'ogg', 'flac', 'aac', 'm4a'].includes(ext);
}

export function FileDropZone({ onFiles, disabled }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const valid = Array.from(fileList).filter(isAudioFile);
    if (valid.length > 0) onFiles(valid);
  }, [onFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  }, [disabled, handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div
      className={`norm-dropzone${isDragging ? ' norm-dropzone--active' : ''}${disabled ? ' norm-dropzone--disabled' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="norm-dropzone__content">
        <svg className="norm-dropzone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="norm-dropzone__label">
          Drop audio files here or click to browse
        </p>
        <p className="norm-dropzone__hint">WAV, MP3, OGG, FLAC, AAC</p>
      </div>
    </div>
  );
}
