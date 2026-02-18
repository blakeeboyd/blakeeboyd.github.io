import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import type { DocumentType, DocumentMeta } from '@/types/documents';
import { useDocumentStore } from '@/store/document-store';
import { DocumentCard } from '@/components/shared/DocumentCard';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface SidebarProps {
  type: DocumentType;
  basePath: string;
}

export function Sidebar({ type, basePath }: SidebarProps) {
  const documents = useDocumentStore(useShallow(s => s.getDocumentsByType(type)));
  const createDocument = useDocumentStore(s => s.createDocument);
  const deleteDocument = useDocumentStore(s => s.deleteDocument);
  const navigate = useNavigate();
  const { id: activeId } = useParams();
  const [deleteTarget, setDeleteTarget] = useState<DocumentMeta | null>(null);
  const [search, setSearch] = useState('');

  const filtered = search
    ? documents.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    : documents;

  const handleCreate = () => {
    const id = createDocument(type);
    navigate(`${basePath}/${id}`);
  };

  const handleSelect = (doc: DocumentMeta) => {
    navigate(`${basePath}/${doc.id}`);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteDocument(deleteTarget.id);
      if (deleteTarget.id === activeId) {
        navigate(basePath);
      }
      setDeleteTarget(null);
    }
  };

  return (
    <aside className="advc-sidebar">
      <div className="advc-sidebar__header">
        <h2 className="advc-sidebar__title">Documents</h2>
        <button className="advc-btn advc-btn--primary advc-btn--sm" onClick={handleCreate}>
          + New
        </button>
      </div>
      {documents.length > 3 && (
        <input
          className="advc-sidebar__search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      {filtered.length === 0 ? (
        <p style={{ fontSize: '0.8rem', color: 'var(--advc-text-tertiary)', padding: '8px 0' }}>
          {documents.length === 0 ? 'No documents yet. Create one to get started.' : 'No matches.'}
        </p>
      ) : (
        filtered.map(doc => (
          <DocumentCard
            key={doc.id}
            doc={doc}
            isActive={doc.id === activeId}
            onClick={() => handleSelect(doc)}
            onDelete={() => setDeleteTarget(doc)}
          />
        ))
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Document"
          message={`Delete "${deleteTarget.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </aside>
  );
}
