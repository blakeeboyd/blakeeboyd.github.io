import { useEffect, useRef, useCallback } from 'react';
import { AudioEngine } from '../audio/engine';
import { useGraphStore } from '../store/graph-store';
import { useTransportStore } from '../store/transport-store';
import { useEditorStore } from '../store/editor-store';
import { resolveMuteState } from '../audio/solo-mute-resolver';
import { getManifest } from '../modules/registry';

/** Module-level engine ref for synchronous access from any component */
let _engineRef: AudioEngine | null = null;

/** Get the live AudioEngine instance (null before initialization) */
export function getEngine(): AudioEngine | null {
  return _engineRef;
}

/**
 * Bridges the Zustand graph store, transport store, and editor store to the AudioEngine.
 * Subscribes to store changes and calls engine.reconcile().
 * Drives playback start/stop and position tracking via rAF.
 */
export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);
  const initializedRef = useRef(false);
  const rafRef = useRef<number>(0);
  const playbackStartCtxTime = useRef(0);
  const playbackStartOffset = useRef(0);

  // Create engine once
  if (!engineRef.current) {
    engineRef.current = new AudioEngine();
    _engineRef = engineRef.current;
  }

  const initialize = useCallback(async () => {
    if (initializedRef.current) return;
    const engine = engineRef.current!;
    await engine.initialize();
    initializedRef.current = true;

    // Run initial reconcile with current state
    const { nodes, edges } = useGraphStore.getState();
    engine.reconcile(nodes, edges);

    // Push initial regions to all track processors
    const { regions } = useEditorStore.getState();
    for (const [trackId, trackRegions] of Object.entries(regions)) {
      engine.updateTrackRegions(trackId, trackRegions);
    }
  }, []);

  // Position tracking loop
  const tickPosition = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || !useTransportStore.getState().isPlaying) return;

    const elapsed = engine.currentTime - playbackStartCtxTime.current;
    const newPos = playbackStartOffset.current + elapsed;
    useTransportStore.getState().setPosition(newPos);

    rafRef.current = requestAnimationFrame(tickPosition);
  }, []);

  // Subscribe to graph store changes and reconcile
  useEffect(() => {
    const unsubscribe = useGraphStore.subscribe((state) => {
      if (initializedRef.current && engineRef.current) {
        engineRef.current.reconcile(state.nodes, state.edges);
        // Resolve and apply solo/mute state
        const muteMap = resolveMuteState(state.nodes, state.edges, getManifest);
        engineRef.current.applyMuteState(muteMap);
      }
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(rafRef.current);
      engineRef.current?.dispose();
      engineRef.current = null;
      _engineRef = null;
      initializedRef.current = false;
    };
  }, []);

  // Subscribe to transport state changes
  useEffect(() => {
    const unsubscribe = useTransportStore.subscribe(
      (state, prev) => {
        const engine = engineRef.current;
        if (!engine || !initializedRef.current) return;

        // Play started
        if (state.isPlaying && !prev.isPlaying) {
          playbackStartOffset.current = state.position;
          playbackStartCtxTime.current = engine.currentTime;
          engine.startPlayback(state.position);
          rafRef.current = requestAnimationFrame(tickPosition);
        }

        // Stopped or paused
        if (!state.isPlaying && prev.isPlaying) {
          cancelAnimationFrame(rafRef.current);
          engine.stopPlayback();
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [tickPosition]);

  // Subscribe to editor store region changes
  useEffect(() => {
    const unsubscribe = useEditorStore.subscribe(
      (state, prev) => {
        const engine = engineRef.current;
        if (!engine || !initializedRef.current) return;

        if (state.regions !== prev.regions) {
          // Push updated regions to all affected track processors
          for (const [trackId, trackRegions] of Object.entries(state.regions)) {
            engine.updateTrackRegions(trackId, trackRegions);
          }

          // If playing, restart playback to apply region changes
          if (useTransportStore.getState().isPlaying) {
            const pos = useTransportStore.getState().position;
            engine.stopPlayback();
            playbackStartOffset.current = pos;
            playbackStartCtxTime.current = engine.currentTime;
            engine.startPlayback(pos);
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    initialize,
    get audioContext() {
      return engineRef.current?.audioContext ?? null;
    },
  };
}
