const PREFIX = 'advc';
const OLD_PREFIX = 'adv';

function key(type: string, id: string): string {
  return `${PREFIX}-${type}-${id}`;
}

function oldKey(type: string, id: string): string {
  return `${OLD_PREFIX}-${type}-${id}`;
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
    let raw = localStorage.getItem(key(type, id));
    // Migrate from old 'adv-' prefix if new key doesn't exist
    if (!raw) {
      raw = localStorage.getItem(oldKey(type, id));
      if (raw) {
        localStorage.setItem(key(type, id), raw);
        localStorage.removeItem(oldKey(type, id));
      }
    }
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function deleteDocumentData(type: string, id: string): void {
  localStorage.removeItem(key(type, id));
  localStorage.removeItem(oldKey(type, id));
}
