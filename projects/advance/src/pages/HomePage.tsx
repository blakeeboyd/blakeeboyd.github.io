import { Link } from 'react-router-dom';
import { useDocumentStore } from '@/store/document-store';
import { DocumentCard } from '@/components/shared/DocumentCard';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { DocumentMeta } from '@/types/documents';

const TOOL_PATH: Record<string, string> = {
  'patch-sheet': '/patch-sheets',
  'stage-plot': '/stage-plots',
  'run-of-show': '/run-of-show',
};

export function HomePage() {
  const documents = useDocumentStore(s => s.documents);
  const deleteDocument = useDocumentStore(s => s.deleteDocument);
  const [deleteTarget, setDeleteTarget] = useState<DocumentMeta | null>(null);

  const recent = [...documents]
    .sort((a, b) => b.lastEditedAt.localeCompare(a.lastEditedAt))
    .slice(0, 5);

  return (
    <div className="advc-home">
      <h2 className="advc-home__title">Advance</h2>
      <p className="advc-home__subtitle">Get ahead of the show. Patch sheets, stage plots, and run of show for live sound.</p>

      <div className="advc-home__tools">
        <Link to="/patch-sheets" className="advc-tool-card" style={{ textDecoration: 'none' }}>
          <div className="advc-tool-card__icon" style={{ background: 'var(--advc-color-patch)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h3 className="advc-tool-card__name">Patch Sheet</h3>
          <p className="advc-tool-card__desc">Input/output channel mapping for live shows. Track microphones, connections, and signal routing.</p>
        </Link>

        <Link to="/stage-plots" className="advc-tool-card" style={{ textDecoration: 'none' }}>
          <div className="advc-tool-card__icon" style={{ background: 'var(--advc-color-stage)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <circle cx="15.5" cy="8.5" r="1.5" />
              <circle cx="12" cy="14" r="1.5" />
            </svg>
          </div>
          <h3 className="advc-tool-card__name">Stage Plot</h3>
          <p className="advc-tool-card__desc">Visual stage layout designer. Place instruments, monitors, and equipment on a 2D canvas.</p>
        </Link>

        <Link to="/run-of-show" className="advc-tool-card" style={{ textDecoration: 'none' }}>
          <div className="advc-tool-card__icon" style={{ background: 'var(--advc-color-ros)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3 className="advc-tool-card__name">Run of Show</h3>
          <p className="advc-tool-card__desc">Event timeline editor with auto-calculated start times, custom columns, and section headers.</p>
        </Link>

      </div>

      {recent.length > 0 && (
        <div className="advc-home__recent">
          <h4 className="advc-home__recent-title">Recent Documents</h4>
          {recent.map(doc => (
            <Link key={doc.id} to={`${TOOL_PATH[doc.type]}/${doc.id}`} style={{ textDecoration: 'none' }}>
              <DocumentCard
                doc={doc}
                isActive={false}
                onClick={() => {}}
                onDelete={() => setDeleteTarget(doc)}
              />
            </Link>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Document"
          message={`Delete "${deleteTarget.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => {
            deleteDocument(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
