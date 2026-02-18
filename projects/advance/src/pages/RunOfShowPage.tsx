import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toolbar } from '@/components/layout/Toolbar';
import { RunOfShowEditor } from '@/components/run-of-show/RunOfShowEditor';
import { ExportMenu } from '@/components/shared/ExportMenu';
import { EmptyState } from '@/components/shared/EmptyState';
import { useRunOfShowStore } from '@/store/run-of-show-store';
import { useDocumentStore } from '@/store/document-store';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useUndoRedo } from '@/hooks/use-undo-redo';
import { exportRunOfShowPdf } from '@/lib/export-pdf';
import type { RunOfShowDoc } from '@/types/run-of-show';
import type { ExportableDoc } from '@/lib/export-json';

export function RunOfShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loadDocument = useRunOfShowStore(s => s.loadDocument);
  const documentId = useRunOfShowStore(s => s.documentId);
  const items = useRunOfShowStore(s => s.items);
  const customColumns = useRunOfShowStore(s => s.customColumns);
  const saveToStorage = useRunOfShowStore(s => s.saveToStorage);
  const getExportData = useRunOfShowStore(s => s.getExportData);
  const importDocument = useRunOfShowStore(s => s.importDocument);
  const createDocument = useDocumentStore(s => s.createDocument);
  const getDocument = useDocumentStore(s => s.getDocument);

  const { undo, redo, canUndo, canRedo } = useUndoRedo(useRunOfShowStore.temporal);

  useEffect(() => {
    if (id) loadDocument(id);
  }, [id, loadDocument]);

  const saveStatus = useAutoSave(documentId, saveToStorage, [items, customColumns]);

  const handleImport = (doc: ExportableDoc) => {
    if (doc.type !== 'run-of-show') {
      alert('This is not a run of show document');
      return;
    }
    const newId = createDocument('run-of-show', 'Imported Run of Show');
    importDocument(doc as RunOfShowDoc, newId);
    navigate(`/run-of-show/${newId}`);
  };

  const handleExportPdf = () => {
    const data = getExportData();
    const doc = getDocument(documentId!);
    exportRunOfShowPdf(data, doc?.name ?? 'Run of Show');
  };

  return (
    <div className="advc-page">
      <Sidebar type="run-of-show" basePath="/run-of-show" />
      <div className="advc-main">
        {id && documentId ? (
          <>
            <Toolbar
              documentId={documentId}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              saveStatus={saveStatus}
            >
              <ExportMenu
                getExportData={getExportData}
                documentName={getDocument(documentId)?.name ?? 'Run of Show'}
                onImport={handleImport}
                onExportPdf={handleExportPdf}
              />
            </Toolbar>
            <RunOfShowEditor />
          </>
        ) : (
          <EmptyState
            message="Select a run of show from the sidebar or create a new one."
            actionLabel="+ New Run of Show"
            onAction={() => {
              const newId = createDocument('run-of-show');
              navigate(`/run-of-show/${newId}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
