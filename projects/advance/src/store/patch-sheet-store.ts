import { create } from 'zustand';
import { temporal } from 'zundo';
import type { PatchSheetMetadata, InputChannel, OutputChannel, PatchSheetDoc } from '@/types/patch-sheet';
import { createId } from '@/lib/id';
import { saveDocumentData, loadDocumentData } from '@/lib/storage';
import { useDocumentStore } from './document-store';

interface PatchSheetState {
  documentId: string | null;
  metadata: PatchSheetMetadata;
  inputs: InputChannel[];
  outputs: OutputChannel[];
  activeTab: 'inputs' | 'outputs';

  setMetadata: (patch: Partial<PatchSheetMetadata>) => void;
  setActiveTab: (tab: 'inputs' | 'outputs') => void;

  addInput: (afterIndex?: number) => void;
  updateInput: (id: string, patch: Partial<InputChannel>) => void;
  removeInput: (id: string) => void;
  reorderInputs: (fromIndex: number, toIndex: number) => void;

  addOutput: (afterIndex?: number) => void;
  updateOutput: (id: string, patch: Partial<OutputChannel>) => void;
  removeOutput: (id: string) => void;
  reorderOutputs: (fromIndex: number, toIndex: number) => void;

  loadDocument: (id: string) => void;
  saveToStorage: () => void;
  getExportData: () => PatchSheetDoc;
  importDocument: (doc: PatchSheetDoc, id: string) => void;
}

function createDefaultInput(channelNumber: string): InputChannel {
  return {
    id: createId(),
    channelNumber,
    name: '',
    micType: '',
    device: '',
    phantom: false,
    connection: '',
    connectionDetails: '',
    notes: '',
    isStereo: false,
    stereoChannelNumber: '',
  };
}

function createDefaultOutput(channelNumber: string): OutputChannel {
  return {
    id: createId(),
    channelNumber,
    name: '',
    sourceType: '',
    sourceDetails: '',
    destinationType: '',
    destinationGear: '',
    notes: '',
  };
}

const defaultMetadata: PatchSheetMetadata = {
  venue: '',
  date: '',
  fohEngineer: '',
  monitorEngineer: '',
  notes: '',
};

export const usePatchSheetStore = create<PatchSheetState>()(
  temporal(
    (set, get) => ({
      documentId: null,
      metadata: { ...defaultMetadata },
      inputs: [],
      outputs: [],
      activeTab: 'inputs',

      setMetadata: (patch) => set({ metadata: { ...get().metadata, ...patch } }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      addInput: (afterIndex) => {
        const inputs = [...get().inputs];
        const num = String(inputs.length + 1);
        const newRow = createDefaultInput(num);
        if (afterIndex !== undefined) {
          inputs.splice(afterIndex + 1, 0, newRow);
        } else {
          inputs.push(newRow);
        }
        set({ inputs });
      },

      updateInput: (id, patch) => {
        set({ inputs: get().inputs.map(ch => ch.id === id ? { ...ch, ...patch } : ch) });
      },

      removeInput: (id) => {
        set({ inputs: get().inputs.filter(ch => ch.id !== id) });
      },

      reorderInputs: (fromIndex, toIndex) => {
        const inputs = [...get().inputs];
        const [moved] = inputs.splice(fromIndex, 1);
        inputs.splice(toIndex, 0, moved);
        set({ inputs });
      },

      addOutput: (afterIndex) => {
        const outputs = [...get().outputs];
        const num = String(outputs.length + 1);
        const newRow = createDefaultOutput(num);
        if (afterIndex !== undefined) {
          outputs.splice(afterIndex + 1, 0, newRow);
        } else {
          outputs.push(newRow);
        }
        set({ outputs });
      },

      updateOutput: (id, patch) => {
        set({ outputs: get().outputs.map(ch => ch.id === id ? { ...ch, ...patch } : ch) });
      },

      removeOutput: (id) => {
        set({ outputs: get().outputs.filter(ch => ch.id !== id) });
      },

      reorderOutputs: (fromIndex, toIndex) => {
        const outputs = [...get().outputs];
        const [moved] = outputs.splice(fromIndex, 1);
        outputs.splice(toIndex, 0, moved);
        set({ outputs });
      },

      loadDocument: (id) => {
        const data = loadDocumentData<PatchSheetDoc>('patch', id);
        if (data) {
          set({
            documentId: id,
            metadata: data.metadata,
            inputs: data.inputs,
            outputs: data.outputs,
            activeTab: 'inputs',
          });
        } else {
          set({
            documentId: id,
            metadata: { ...defaultMetadata },
            inputs: [],
            outputs: [],
            activeTab: 'inputs',
          });
        }
      },

      saveToStorage: () => {
        const { documentId } = get();
        if (!documentId) return;
        const doc = get().getExportData();
        saveDocumentData('patch', documentId, doc);
        useDocumentStore.getState().touchDocument(documentId);
      },

      getExportData: (): PatchSheetDoc => ({
        version: 1,
        type: 'patch-sheet',
        metadata: get().metadata,
        inputs: get().inputs,
        outputs: get().outputs,
      }),

      importDocument: (doc, id) => {
        set({
          documentId: id,
          metadata: doc.metadata,
          inputs: doc.inputs,
          outputs: doc.outputs,
          activeTab: 'inputs',
        });
        saveDocumentData('patch', id, doc);
      },
    }),
    {
      limit: 100,
      partialize: (state) => ({
        metadata: state.metadata,
        inputs: state.inputs,
        outputs: state.outputs,
      }),
    }
  )
);
