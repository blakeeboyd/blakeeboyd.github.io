import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DocumentMeta, DocumentType } from '@/types/documents';
import { createId } from '@/lib/id';
import { deleteDocumentData } from '@/lib/storage';

const STORAGE_TYPE_MAP: Record<DocumentType, string> = {
  'patch-sheet': 'patch',
  'stage-plot': 'stage',
  'run-of-show': 'ros',
};

interface DocumentRegistryState {
  documents: DocumentMeta[];
  createDocument: (type: DocumentType, name?: string) => string;
  deleteDocument: (id: string) => void;
  renameDocument: (id: string, name: string) => void;
  touchDocument: (id: string) => void;
  getDocument: (id: string) => DocumentMeta | undefined;
  getDocumentsByType: (type: DocumentType) => DocumentMeta[];
}

const DEFAULT_NAMES: Record<DocumentType, string> = {
  'patch-sheet': 'Untitled Patch Sheet',
  'stage-plot': 'Untitled Stage Plot',
  'run-of-show': 'Untitled Run of Show',
};

export const useDocumentStore = create<DocumentRegistryState>()(
  persist(
    (set, get) => ({
      documents: [],

      createDocument: (type, name) => {
        const id = createId();
        const now = new Date().toISOString();
        const doc: DocumentMeta = {
          id,
          type,
          name: name ?? DEFAULT_NAMES[type],
          createdAt: now,
          lastEditedAt: now,
        };
        set({ documents: [...get().documents, doc] });
        return id;
      },

      deleteDocument: (id) => {
        const doc = get().documents.find(d => d.id === id);
        if (doc) {
          deleteDocumentData(STORAGE_TYPE_MAP[doc.type], id);
        }
        set({ documents: get().documents.filter(d => d.id !== id) });
      },

      renameDocument: (id, name) => {
        set({
          documents: get().documents.map(d =>
            d.id === id ? { ...d, name, lastEditedAt: new Date().toISOString() } : d
          ),
        });
      },

      touchDocument: (id) => {
        set({
          documents: get().documents.map(d =>
            d.id === id ? { ...d, lastEditedAt: new Date().toISOString() } : d
          ),
        });
      },

      getDocument: (id) => get().documents.find(d => d.id === id),

      getDocumentsByType: (type) =>
        get().documents
          .filter(d => d.type === type)
          .sort((a, b) => b.lastEditedAt.localeCompare(a.lastEditedAt)),
    }),
    {
      name: 'advc-documents',
      // Migrate from old 'adv-documents' key
      storage: {
        getItem: (name: string) => {
          let raw = localStorage.getItem(name);
          if (!raw && name === 'advc-documents') {
            raw = localStorage.getItem('adv-documents');
            if (raw) {
              localStorage.setItem(name, raw);
              localStorage.removeItem('adv-documents');
            }
          }
          return raw ? JSON.parse(raw) : null;
        },
        setItem: (name: string, value: unknown) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
