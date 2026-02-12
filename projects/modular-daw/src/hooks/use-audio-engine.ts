import { useEffect, useRef, useCallback } from 'react';
import { AudioEngine } from '../audio/engine';
import { useGraphStore } from '../store/graph-store';

/**
 * Bridges the Zustand graph store to the AudioEngine.
 * Subscribes to store changes and calls engine.reconcile().
 * Exposes initialize() for user-gesture-gated AudioContext creation.
 */
export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);
  const initializedRef = useRef(false);

  // Create engine once
  if (!engineRef.current) {
    engineRef.current = new AudioEngine();
  }

  const initialize = useCallback(async () => {
    if (initializedRef.current) return;
    const engine = engineRef.current!;
    await engine.initialize();
    initializedRef.current = true;

    // Run initial reconcile with current state
    const { nodes, edges } = useGraphStore.getState();
    engine.reconcile(nodes, edges);
  }, []);

  // Subscribe to store changes and reconcile
  useEffect(() => {
    const unsubscribe = useGraphStore.subscribe((state) => {
      if (initializedRef.current && engineRef.current) {
        engineRef.current.reconcile(state.nodes, state.edges);
      }
    });

    return () => {
      unsubscribe();
      engineRef.current?.dispose();
      engineRef.current = null;
      initializedRef.current = false;
    };
  }, []);

  return {
    initialize,
    get audioContext() {
      return engineRef.current?.audioContext ?? null;
    },
  };
}
