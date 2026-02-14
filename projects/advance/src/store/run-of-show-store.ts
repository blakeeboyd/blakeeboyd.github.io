import { create } from 'zustand';
import { temporal } from 'zundo';
import type { RunOfShowItem, CustomColumnDef, RunOfShowDoc } from '@/types/run-of-show';
import { createId } from '@/lib/id';
import { saveDocumentData, loadDocumentData } from '@/lib/storage';
import { useDocumentStore } from './document-store';
import { parseTime, parseDuration, formatTime } from '@/lib/time-utils';

interface RunOfShowState {
  documentId: string | null;
  items: RunOfShowItem[];
  customColumns: CustomColumnDef[];

  addItem: (afterIndex?: number) => void;
  addSectionHeader: (afterIndex?: number) => void;
  updateItem: (id: string, patch: Partial<RunOfShowItem>) => void;
  removeItem: (id: string) => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
  setItemHighlight: (id: string, color: string | null) => void;

  addCustomColumn: (name: string, type: 'text' | 'number' | 'time') => void;
  renameCustomColumn: (id: string, name: string) => void;
  removeCustomColumn: (id: string) => void;

  recalculateTimes: () => void;

  loadDocument: (id: string) => void;
  saveToStorage: () => void;
  getExportData: () => RunOfShowDoc;
  importDocument: (doc: RunOfShowDoc, id: string) => void;
}

function createDefaultItem(): RunOfShowItem {
  return {
    id: createId(),
    type: 'item',
    itemNumber: '',
    startTime: '',
    duration: '',
    audio: '',
    video: '',
    lights: '',
    productionNotes: '',
    privateNotes: '',
    highlightColor: null,
    headerTitle: '',
    customFields: {},
  };
}

function createDefaultHeader(): RunOfShowItem {
  return {
    id: createId(),
    type: 'header',
    itemNumber: '',
    startTime: '',
    duration: '',
    audio: '',
    video: '',
    lights: '',
    productionNotes: '',
    privateNotes: '',
    highlightColor: null,
    headerTitle: 'New Section',
    customFields: {},
  };
}

export const useRunOfShowStore = create<RunOfShowState>()(
  temporal(
    (set, get) => ({
      documentId: null,
      items: [],
      customColumns: [],

      addItem: (afterIndex) => {
        const items = [...get().items];
        const newItem = createDefaultItem();
        if (afterIndex !== undefined) {
          items.splice(afterIndex + 1, 0, newItem);
        } else {
          items.push(newItem);
        }
        set({ items });
      },

      addSectionHeader: (afterIndex) => {
        const items = [...get().items];
        const header = createDefaultHeader();
        if (afterIndex !== undefined) {
          items.splice(afterIndex + 1, 0, header);
        } else {
          items.push(header);
        }
        set({ items });
      },

      updateItem: (id, patch) => {
        set({ items: get().items.map(item => item.id === id ? { ...item, ...patch } : item) });
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },

      reorderItems: (fromIndex, toIndex) => {
        const items = [...get().items];
        const [moved] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, moved);
        set({ items });
      },

      setItemHighlight: (id, color) => {
        set({ items: get().items.map(item => item.id === id ? { ...item, highlightColor: color } : item) });
      },

      addCustomColumn: (name, type) => {
        const col: CustomColumnDef = { id: createId(), name, type, highlightColor: null };
        set({ customColumns: [...get().customColumns, col] });
      },

      renameCustomColumn: (id, name) => {
        set({ customColumns: get().customColumns.map(c => c.id === id ? { ...c, name } : c) });
      },

      removeCustomColumn: (id) => {
        set({
          customColumns: get().customColumns.filter(c => c.id !== id),
          items: get().items.map(item => {
            const fields = { ...item.customFields };
            delete fields[id];
            return { ...item, customFields: fields };
          }),
        });
      },

      recalculateTimes: () => {
        const items = [...get().items];
        for (let i = 1; i < items.length; i++) {
          const prev = items[i - 1];
          if (prev.type === 'item' && prev.startTime && prev.duration) {
            const startSec = parseTime(prev.startTime);
            const durSec = parseDuration(prev.duration);
            if (!isNaN(startSec) && !isNaN(durSec)) {
              const nextStart = formatTime(startSec + durSec);
              if (items[i].type === 'item' && !items[i].startTime) {
                items[i] = { ...items[i], startTime: nextStart };
              }
            }
          }
        }
        set({ items });
      },

      loadDocument: (id) => {
        const data = loadDocumentData<RunOfShowDoc>('ros', id);
        if (data) {
          set({
            documentId: id,
            items: data.items,
            customColumns: data.customColumns,
          });
        } else {
          set({
            documentId: id,
            items: [],
            customColumns: [],
          });
        }
      },

      saveToStorage: () => {
        const { documentId } = get();
        if (!documentId) return;
        const doc = get().getExportData();
        saveDocumentData('ros', documentId, doc);
        useDocumentStore.getState().touchDocument(documentId);
      },

      getExportData: (): RunOfShowDoc => ({
        version: 1,
        type: 'run-of-show',
        items: get().items,
        customColumns: get().customColumns,
      }),

      importDocument: (doc, id) => {
        set({
          documentId: id,
          items: doc.items,
          customColumns: doc.customColumns,
        });
        saveDocumentData('ros', id, doc);
      },
    }),
    {
      limit: 100,
      partialize: (state) => ({
        items: state.items,
        customColumns: state.customColumns,
      }),
    }
  )
);
