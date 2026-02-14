import { create } from 'zustand';
import { temporal } from 'zundo';
import type { StageSize, StageElement, StagePlotDoc } from '@/types/stage-plot';
import { createId } from '@/lib/id';
import { saveDocumentData, loadDocumentData } from '@/lib/storage';
import { useDocumentStore } from './document-store';
import { ELEMENT_TYPES } from '@/components/stage-plot/element-types';

interface StagePlotState {
  documentId: string | null;
  stageSize: StageSize;
  elements: StageElement[];
  selectedElementId: string | null;
  backgroundImage: string | null;
  backgroundOpacity: number;
  gridSnap: boolean;

  setStageSize: (size: StageSize) => void;
  addElement: (type: string, position: { x: number; y: number }) => string;
  updateElement: (id: string, patch: Partial<StageElement>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => string;
  selectElement: (id: string | null) => void;
  setBackground: (dataUrl: string | null, opacity?: number) => void;
  toggleGridSnap: () => void;

  loadDocument: (id: string) => void;
  saveToStorage: () => void;
  getExportData: () => StagePlotDoc;
  importDocument: (doc: StagePlotDoc, id: string) => void;
}

export const useStagePlotStore = create<StagePlotState>()(
  temporal(
    (set, get) => ({
      documentId: null,
      stageSize: 'medium-wide',
      elements: [],
      selectedElementId: null,
      backgroundImage: null,
      backgroundOpacity: 0.3,
      gridSnap: false,

      setStageSize: (stageSize) => set({ stageSize }),

      toggleGridSnap: () => set({ gridSnap: !get().gridSnap }),

      addElement: (type, position) => {
        const def = ELEMENT_TYPES.find(e => e.type === type);
        const id = createId();
        const el: StageElement = {
          id,
          type,
          label: def?.name ?? type,
          x: position.x,
          y: position.y,
          width: def?.defaultWidth ?? 60,
          height: def?.defaultHeight ?? 60,
          rotation: 0,
          color: def?.defaultColor ?? '#6b7280',
          labelVisible: true,
        };
        set({ elements: [...get().elements, el], selectedElementId: id });
        return id;
      },

      updateElement: (id, patch) => {
        set({ elements: get().elements.map(el => el.id === id ? { ...el, ...patch } : el) });
      },

      removeElement: (id) => {
        set({
          elements: get().elements.filter(el => el.id !== id),
          selectedElementId: get().selectedElementId === id ? null : get().selectedElementId,
        });
      },

      duplicateElement: (id) => {
        const el = get().elements.find(e => e.id === id);
        if (!el) return '';
        const newId = createId();
        const dup: StageElement = { ...el, id: newId, x: el.x + 20, y: el.y + 20 };
        set({ elements: [...get().elements, dup], selectedElementId: newId });
        return newId;
      },

      selectElement: (id) => set({ selectedElementId: id }),

      setBackground: (dataUrl, opacity) => {
        const patch: Partial<StagePlotState> = { backgroundImage: dataUrl };
        if (opacity !== undefined) patch.backgroundOpacity = opacity;
        set(patch);
      },

      loadDocument: (id) => {
        const data = loadDocumentData<StagePlotDoc>('stage', id);
        if (data) {
          set({
            documentId: id,
            stageSize: data.stageSize,
            elements: data.elements,
            selectedElementId: null,
            backgroundImage: data.backgroundImage,
            backgroundOpacity: data.backgroundOpacity,
          });
        } else {
          set({
            documentId: id,
            stageSize: 'medium-wide',
            elements: [],
            selectedElementId: null,
            backgroundImage: null,
            backgroundOpacity: 0.3,
          });
        }
      },

      saveToStorage: () => {
        const { documentId } = get();
        if (!documentId) return;
        const doc = get().getExportData();
        saveDocumentData('stage', documentId, doc);
        useDocumentStore.getState().touchDocument(documentId);
      },

      getExportData: (): StagePlotDoc => ({
        version: 1,
        type: 'stage-plot',
        stageSize: get().stageSize,
        elements: get().elements,
        backgroundImage: get().backgroundImage,
        backgroundOpacity: get().backgroundOpacity,
      }),

      importDocument: (doc, id) => {
        set({
          documentId: id,
          stageSize: doc.stageSize,
          elements: doc.elements,
          selectedElementId: null,
          backgroundImage: doc.backgroundImage,
          backgroundOpacity: doc.backgroundOpacity,
        });
        saveDocumentData('stage', id, doc);
      },
    }),
    {
      limit: 100,
      partialize: (state) => ({
        stageSize: state.stageSize,
        elements: state.elements,
        backgroundImage: state.backgroundImage,
        backgroundOpacity: state.backgroundOpacity,
      }),
    }
  )
);
