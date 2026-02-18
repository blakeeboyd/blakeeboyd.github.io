import { useDocumentStore } from '@/store/document-store';
import type { ReactNode } from 'react';
import type { SaveStatus } from '@/hooks/use-auto-save';

interface ToolbarProps {
  documentId: string;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  saveStatus?: SaveStatus;
  children?: ReactNode;
}

export function Toolbar({ documentId, onUndo, onRedo, canUndo = true, canRedo = true, saveStatus, children }: ToolbarProps) {
  const docName = useDocumentStore(s => s.getDocument(documentId)?.name ?? '');
  const renameDocument = useDocumentStore(s => s.renameDocument);

  return (
    <div className="advc-toolbar">
      <input
        className="advc-toolbar__name"
        value={docName}
        onChange={(e) => renameDocument(documentId, e.target.value)}
        aria-label="Document name"
      />
      {saveStatus && saveStatus !== 'idle' && (
        <span className={`advc-toolbar__status advc-toolbar__status--${saveStatus}`}>
          {saveStatus === 'pending' ? 'Saving...' : 'Saved'}
        </span>
      )}
      <div className="advc-toolbar__actions">
        {onUndo && (
          <button className="advc-btn advc-btn--sm advc-btn--icon" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
        )}
        {onRedo && (
          <button className="advc-btn advc-btn--sm advc-btn--icon" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        )}
        {children && (
          <>
            <span className="advc-toolbar__separator" />
            {children}
          </>
        )}
      </div>
    </div>
  );
}
