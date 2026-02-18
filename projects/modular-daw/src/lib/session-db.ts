/**
 * Promise-based IndexedDB wrapper for session persistence.
 * DB: modular-daw
 * Object stores:
 *   - sessions: { id, name, updatedAt, graph, editor, transport }
 *   - audio-buffers: { id, channelData[], sampleRate, numberOfChannels }
 */

const DB_NAME = 'modular-daw';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('sessions')) {
        db.createObjectStore('sessions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('audio-buffers')) {
        db.createObjectStore('audio-buffers', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ---------- Sessions ----------

export interface SessionRecord {
  id: string;
  name: string;
  updatedAt: number;
  graph: unknown;
  editor: unknown;
  transport: unknown;
  bufferRefs: string[];  // references into audio-buffers store
}

export async function saveSession(session: SessionRecord): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sessions', 'readwrite');
    tx.objectStore('sessions').put(session);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadSession(id: string): Promise<SessionRecord | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sessions', 'readonly');
    const req = tx.objectStore('sessions').get(id);
    req.onsuccess = () => resolve(req.result as SessionRecord | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteSession(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sessions', 'readwrite');
    tx.objectStore('sessions').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listSessions(): Promise<SessionRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sessions', 'readonly');
    const req = tx.objectStore('sessions').getAll();
    req.onsuccess = () => {
      const sessions = (req.result as SessionRecord[])
        .sort((a, b) => b.updatedAt - a.updatedAt);
      resolve(sessions);
    };
    req.onerror = () => reject(req.error);
  });
}

// ---------- Audio Buffers ----------

export interface AudioBufferRecord {
  id: string;
  channelData: ArrayBuffer[];  // one ArrayBuffer per channel
  sampleRate: number;
  numberOfChannels: number;
  fileName: string;
}

export async function saveAudioBuffer(record: AudioBufferRecord): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('audio-buffers', 'readwrite');
    tx.objectStore('audio-buffers').put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadAudioBuffer(id: string): Promise<AudioBufferRecord | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('audio-buffers', 'readonly');
    const req = tx.objectStore('audio-buffers').get(id);
    req.onsuccess = () => resolve(req.result as AudioBufferRecord | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteAudioBuffer(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('audio-buffers', 'readwrite');
    tx.objectStore('audio-buffers').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
