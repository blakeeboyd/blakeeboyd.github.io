import { useEffect } from 'react';
import { useGraphStore } from '../store/graph-store';

export function useUndoRedo() {
  const temporalStore = useGraphStore.temporal;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        temporalStore.getState().undo();
      } else if (
        (e.key === 'z' && e.shiftKey) ||
        (e.key === 'y' && !e.shiftKey)
      ) {
        e.preventDefault();
        temporalStore.getState().redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [temporalStore]);

  return {
    undo: () => temporalStore.getState().undo(),
    redo: () => temporalStore.getState().redo(),
    canUndo: () => temporalStore.getState().pastStates.length > 0,
    canRedo: () => temporalStore.getState().futureStates.length > 0,
  };
}
