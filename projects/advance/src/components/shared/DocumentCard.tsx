import type { DocumentMeta } from '@/types/documents';

interface DocumentCardProps {
  doc: DocumentMeta;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  'patch-sheet': 'PS',
  'stage-plot': 'SP',
  'run-of-show': 'RoS',
};

const TYPE_CLASSES: Record<string, string> = {
  'patch-sheet': 'advc-doc-card__icon--patch',
  'stage-plot': 'advc-doc-card__icon--stage',
  'run-of-show': 'advc-doc-card__icon--ros',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function DocumentCard({ doc, isActive, onClick, onDelete }: DocumentCardProps) {
  return (
    <div
      className={`advc-doc-card${isActive ? ' advc-doc-card--active' : ''}`}
      onClick={onClick}
    >
      <div className={`advc-doc-card__icon ${TYPE_CLASSES[doc.type]}`}>
        {TYPE_LABELS[doc.type]}
      </div>
      <div className="advc-doc-card__info">
        <p className="advc-doc-card__name">{doc.name}</p>
        <p className="advc-doc-card__meta">{timeAgo(doc.lastEditedAt)}</p>
      </div>
      <button
        className="advc-btn advc-btn--sm advc-btn--icon advc-btn--danger advc-doc-card__delete"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
        title="Delete"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
