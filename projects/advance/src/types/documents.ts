export type DocumentType = 'patch-sheet' | 'stage-plot' | 'run-of-show';

export interface DocumentMeta {
  id: string;
  type: DocumentType;
  name: string;
  createdAt: string;
  lastEditedAt: string;
}
