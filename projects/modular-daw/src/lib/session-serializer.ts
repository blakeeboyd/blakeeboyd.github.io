/**
 * Capture and restore full session state (graph, editor, transport, audio buffers).
 */

import { nanoid } from 'nanoid';
import { useGraphStore } from '../store/graph-store';
import { useEditorStore } from '../store/editor-store';
import { useTransportStore } from '../store/transport-store';
import {
  getBuffer,
  storeBuffer,
  extractPeaks,
  clearAllBuffers,
} from '../store/audio-buffer-cache';
import {
  saveSession as dbSaveSession,
  saveAudioBuffer,
  loadSession as dbLoadSession,
  loadAudioBuffer,
  type SessionRecord,
} from './session-db';
import { getSharedAudioContext } from '../audio/audio-context';

/** Capture current state and persist to IndexedDB */
export async function captureSession(
  name: string,
  existingId?: string,
): Promise<string> {
  const id = existingId ?? nanoid();
  const { nodes, edges } = useGraphStore.getState();
  const { regions } = useEditorStore.getState();
  const { bpm, loopEnabled, loopStart, loopEnd } = useTransportStore.getState();

  // Collect all buffer refs used by nodes and regions
  const bufferRefs = new Set<string>();
  for (const node of nodes) {
    if (node.data.bufferRef) bufferRefs.add(node.data.bufferRef);
  }
  for (const trackRegions of Object.values(regions)) {
    for (const region of trackRegions) {
      bufferRefs.add(region.bufferRef);
    }
  }

  // Save audio buffers to IndexedDB
  for (const ref of bufferRefs) {
    const entry = getBuffer(ref);
    if (!entry) continue;

    const channelData: ArrayBuffer[] = [];
    for (let c = 0; c < entry.buffer.numberOfChannels; c++) {
      // Copy the Float32Array to a standalone ArrayBuffer
      const data = entry.buffer.getChannelData(c);
      const copy = new ArrayBuffer(data.byteLength);
      new Float32Array(copy).set(data);
      channelData.push(copy);
    }

    await saveAudioBuffer({
      id: ref,
      channelData,
      sampleRate: entry.buffer.sampleRate,
      numberOfChannels: entry.buffer.numberOfChannels,
      fileName: entry.fileName,
    });
  }

  // Save session metadata + state
  const session: SessionRecord = {
    id,
    name,
    updatedAt: Date.now(),
    graph: { nodes, edges },
    editor: { regions },
    transport: { bpm, loopEnabled, loopStart, loopEnd },
    bufferRefs: Array.from(bufferRefs),
  };

  await dbSaveSession(session);
  return id;
}

/** Restore session state from IndexedDB */
export async function restoreSession(id: string): Promise<boolean> {
  const session = await dbLoadSession(id);
  if (!session) return false;

  const ctx = getSharedAudioContext();

  // Clear current state
  clearAllBuffers();

  // Load audio buffers from IndexedDB into cache
  for (const ref of session.bufferRefs) {
    const record = await loadAudioBuffer(ref);
    if (!record || !ctx) continue;

    // Reconstruct AudioBuffer from raw channel data
    const buffer = ctx.createBuffer(
      record.numberOfChannels,
      new Float32Array(record.channelData[0]).length,
      record.sampleRate,
    );
    for (let c = 0; c < record.numberOfChannels; c++) {
      buffer.copyToChannel(new Float32Array(record.channelData[c]), c);
    }

    const peaks = extractPeaks(buffer, 200);
    storeBuffer(ref, {
      buffer,
      peaks,
      fileName: record.fileName,
      duration: buffer.duration,
      channelCount: buffer.numberOfChannels,
      sampleRate: buffer.sampleRate,
    });
  }

  // Restore stores
  const graph = session.graph as { nodes: unknown[]; edges: unknown[] };
  const editor = session.editor as { regions: Record<string, unknown[]> };
  const transport = session.transport as {
    bpm: number;
    loopEnabled: boolean;
    loopStart: number;
    loopEnd: number;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useGraphStore.getState().loadPatch(graph.nodes as any, graph.edges as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEditorStore.getState().loadRegions(editor.regions as any);
  useTransportStore.getState().setBpm(transport.bpm);
  if (transport.loopEnabled) {
    useTransportStore.getState().setLoop(transport.loopStart, transport.loopEnd);
  }

  return true;
}

/** Start a new empty session */
export function newSession(): void {
  clearAllBuffers();
  useGraphStore.getState().loadPatch([], []);
  useEditorStore.getState().loadRegions({});
  useTransportStore.getState().stop();
  useTransportStore.getState().seek(0);
}
