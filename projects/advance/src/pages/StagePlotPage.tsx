import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toolbar } from '@/components/layout/Toolbar';
import { StagePlotEditor } from '@/components/stage-plot/StagePlotEditor';
import { ExportMenu } from '@/components/shared/ExportMenu';
import { EmptyState } from '@/components/shared/EmptyState';
import { useStagePlotStore } from '@/store/stage-plot-store';
import { useDocumentStore } from '@/store/document-store';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useUndoRedo } from '@/hooks/use-undo-redo';
import { exportStagePlotPdf } from '@/lib/export-pdf';
import type { StagePlotDoc } from '@/types/stage-plot';
import type { ExportableDoc } from '@/lib/export-json';

export function StagePlotPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loadDocument = useStagePlotStore(s => s.loadDocument);
  const documentId = useStagePlotStore(s => s.documentId);
  const stageSize = useStagePlotStore(s => s.stageSize);
  const elements = useStagePlotStore(s => s.elements);
  const backgroundImage = useStagePlotStore(s => s.backgroundImage);
  const backgroundOpacity = useStagePlotStore(s => s.backgroundOpacity);
  const saveToStorage = useStagePlotStore(s => s.saveToStorage);
  const getExportData = useStagePlotStore(s => s.getExportData);
  const importDocument = useStagePlotStore(s => s.importDocument);
  const createDocument = useDocumentStore(s => s.createDocument);
  const getDocument = useDocumentStore(s => s.getDocument);

  const { undo, redo, canUndo, canRedo } = useUndoRedo(useStagePlotStore.temporal);

  useEffect(() => {
    if (id) loadDocument(id);
  }, [id, loadDocument]);

  const saveStatus = useAutoSave(documentId, saveToStorage, [stageSize, elements, backgroundImage, backgroundOpacity]);

  const handleExportPdf = useCallback(() => {
    const canvasEl = document.querySelector('.advc-stage-canvas') as HTMLElement | null;
    if (!canvasEl) return;
    const name = getDocument(documentId!)?.name ?? 'Stage Plot';
    exportStagePlotPdf(canvasEl, name);
  }, [documentId, getDocument]);

  const handleImport = (doc: ExportableDoc) => {
    if (doc.type !== 'stage-plot') {
      alert('This is not a stage plot document');
      return;
    }
    const newId = createDocument('stage-plot', 'Imported Stage Plot');
    importDocument(doc as StagePlotDoc, newId);
    navigate(`/stage-plots/${newId}`);
  };

  return (
    <div className="advc-page">
      <Sidebar type="stage-plot" basePath="/stage-plots" />
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
                documentName={getDocument(documentId)?.name ?? 'Stage Plot'}
                onImport={handleImport}
                onExportPdf={handleExportPdf}
              />
            </Toolbar>
            <StagePlotEditor />
          </>
        ) : (
          <EmptyState
            message="Select a stage plot from the sidebar or create a new one."
            actionLabel="+ New Stage Plot"
            onAction={() => {
              const newId = createDocument('stage-plot');
              navigate(`/stage-plots/${newId}`);
            }}
          />
        )}
      </div>
    </div>
  );
}
