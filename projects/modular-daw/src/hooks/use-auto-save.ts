import { useEffect, useRef } from 'react';
import { useGraphStore } from '../store/graph-store';
import { useEditorStore } from '../store/editor-store';
import { useTransportStore } from '../store/transport-store';
import { useSessionStore } from '../store/session-store';
import { captureSession } from '../lib/session-serializer';

const AUTO_SAVE_INTERVAL = 30_000; // 30 seconds

/**
 * Auto-saves the session to IndexedDB every 30s if dirty.
 * Only active when a session has been manually saved at least once (has an ID).
 */
export function useAutoSave(): void {
  const dirtyRef = useRef(false);

  // Track dirty state from store changes
  useEffect(() => {
    const unsubs = [
      useGraphStore.subscribe(() => { dirtyRef.current = true; }),
      useEditorStore.subscribe(() => { dirtyRef.current = true; }),
      useTransportStore.subscribe((s, p) => {
        // Only mark dirty for meaningful transport changes (not position ticks)
        if (s.bpm !== p.bpm || s.loopEnabled !== p.loopEnabled ||
            s.loopStart !== p.loopStart || s.loopEnd !== p.loopEnd) {
          dirtyRef.current = true;
        }
      }),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  // Auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      const { currentSessionId, currentSessionName } = useSessionStore.getState();
      if (!currentSessionId || !dirtyRef.current) return;
      dirtyRef.current = false;
      captureSession(currentSessionName, currentSessionId).catch(() => {
        dirtyRef.current = true; // retry next interval
      });
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Save on beforeunload
  useEffect(() => {
    const handler = () => {
      const { currentSessionId, currentSessionName } = useSessionStore.getState();
      if (currentSessionId && dirtyRef.current) {
        captureSession(currentSessionName, currentSessionId).catch(() => {});
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);
}
