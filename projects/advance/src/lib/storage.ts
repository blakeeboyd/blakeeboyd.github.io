const PREFIX = 'adv';

function key(type: string, id: string): string {
  return `${PREFIX}-${type}-${id}`;
}

export function saveDocumentData(type: string, id: string, data: unknown): void {
  try {
    localStorage.setItem(key(type, id), JSON.stringify(data));
  } catch {
    console.warn('Failed to save document data to localStorage');
  }
}

export function loadDocumentData<T>(type: string, id: string): T | null {
  try {
    const raw = localStorage.getItem(key(type, id));
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function deleteDocumentData(type: string, id: string): void {
  localStorage.removeItem(key(type, id));
}
