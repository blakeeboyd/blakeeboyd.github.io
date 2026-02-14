export interface RunOfShowItem {
  id: string;
  type: 'item' | 'header';
  itemNumber: string;
  startTime: string;
  duration: string;
  audio: string;
  video: string;
  lights: string;
  productionNotes: string;
  privateNotes: string;
  highlightColor: string | null;
  headerTitle: string;
  customFields: Record<string, string>;
}

export interface CustomColumnDef {
  id: string;
  name: string;
  type: 'text' | 'number' | 'time';
  highlightColor: string | null;
}

export interface RunOfShowDoc {
  version: 1;
  type: 'run-of-show';
  items: RunOfShowItem[];
  customColumns: CustomColumnDef[];
}
