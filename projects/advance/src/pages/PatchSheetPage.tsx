import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toolbar } from '@/components/layout/Toolbar';
import { PatchSheetEditor } from '@/components/patch-sheet/PatchSheetEditor';
import { ExportMenu } from '@/components/shared/ExportMenu';
import { EmptyState } from '@/components/shared/EmptyState';
import { usePatchSheetStore } from '@/store/patch-sheet-store';
import { useDocumentStore } from '@/store/document-store';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useUndoRedo } from '@/hooks/use-undo-redo';
import { exportPatchSheetPdf } from '@/lib/export-pdf';
import type { PatchSheetDoc } from '@/types/patch-sheet';
import type { ExportableDoc } from '@/lib/export-json';

export function PatchSheetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loadDocument = usePatchSheetStore(s => s.loadDocument);
  const documentId = usePatchSheetStore(s => s.documentId);
  const metadata = usePatchSheetStore(s => s.metadata);
  const inputs = usePatchSheetStore(s => s.inputs);
  const outputs = usePatchSheetStore(s => s.outputs);
  const saveToStorage = usePatchSheetStore(s => s.saveToStorage);
  const getExportData = usePatchSheetStore(s => s.getExportData);
  const importDocument = usePatchSheetStore(s => s.importDocument);
  const createDocument = useDocumentStore(s => s.createDocument);
  const getDocument = useDocumentStore(s => s.getDocument);

  const { undo, redo, canUndo, canRedo } = useUndoRedo(usePatchSheetStore.temporal);

  useEffect(() => {
    if (id) loadDocument(id);
  }, [id, loadDocument]);

  const saveStatus = useAutoSave(documentId, saveToStorage, [metadata, inputs, outputs]);

  const handleImport = (doc: ExportableDoc) => {
    if (doc.type !== 'patch-sheet') {
      alert('This is not a patch sheet document');
      return;
    }
    const newId = createDocument('patch-sheet', 'Imported Patch Sheet');
    importDocument(doc as PatchSheetDoc, newId);
    navigate(`/patch-sheets/${newId}`);
  };

  const handleExportPdf = () => {
    const data = getExportData();
    const doc = getDocument(documentId!);
    exportPatchSheetPdf(data, doc?.name ?? 'Patch Sheet');
  };

  return (
    <div className="advc-page">
      <Sidebar type="patch-sheet" basePath="/patch-sheets" />
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
                documentName={getDocument(documentId)?.name ?? 'Patch Sheet'}
                onImport={handleImport}
                onExportPdf={handleExportPdf}
              />
            </Toolbar>
            <PatchSheetEditor />
          </>
        ) : (
          <EmptyState
            message="Select a patch sheet from the sidebar or create a new one."
            actionLabel="+ New Patch Sheet"
            onAction={() => {
              const newId = createDocument('patch-sheet');
              navigate(`/patch-sheets/${newId}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
