import { useEffect, useCallback, useSyncExternalStore } from 'react';
import type { StoreApi } from 'zustand';
import type { TemporalState } from 'zundo';

export function useUndoRedo<T>(temporalStore: StoreApi<TemporalState<T>>) {
  const undo = useCallback(() => temporalStore.getState().undo(), [temporalStore]);
  const redo = useCallback(() => temporalStore.getState().redo(), [temporalStore]);

  const canUndo = useSyncExternalStore(
    temporalStore.subscribe,
    () => temporalStore.getState().pastStates.length > 0,
  );
  const canRedo = useSyncExternalStore(
    temporalStore.subscribe,
    () => temporalStore.getState().futureStates.length > 0,
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === 'z' && e.shiftKey) || (e.key === 'y' && !e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return { undo, redo, canUndo, canRedo };
}
