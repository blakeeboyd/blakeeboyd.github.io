import type { PatchSheetDoc } from '@/types/patch-sheet';
import type { StagePlotDoc } from '@/types/stage-plot';
import type { RunOfShowDoc } from '@/types/run-of-show';

export type ExportableDoc = PatchSheetDoc | StagePlotDoc | RunOfShowDoc;

export function exportJson(doc: ExportableDoc, filename: string): void {
  const json = JSON.stringify(doc, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJson(file: File): Promise<ExportableDoc> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data.version || !data.type) {
          reject(new Error('Invalid Advance file: missing version or type'));
          return;
        }
        if (!['patch-sheet', 'stage-plot', 'run-of-show'].includes(data.type)) {
          reject(new Error(`Unknown document type: ${data.type}`));
          return;
        }
        resolve(data as ExportableDoc);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
