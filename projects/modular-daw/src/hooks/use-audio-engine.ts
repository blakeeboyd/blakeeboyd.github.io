import { useEffect, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { AudioEngine } from '../audio/engine';
import { useGraphStore } from '../store/graph-store';
import { useTransportStore } from '../store/transport-store';
import { useEditorStore } from '../store/editor-store';
import { useRecordingStore } from '../store/recording-store';
import { resolveMuteState } from '../audio/solo-mute-resolver';
import { getManifest } from '../modules/registry';
import { requestMicInput, disposeMicInput } from '../audio/input-manager';
import { storeBuffer, extractPeaks } from '../store/audio-buffer-cache';

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

    // Measure and store latency
    const latency = engine.measureLatency();
    useRecordingStore.getState().setLatencyCompensation(latency);

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
    const transport = useTransportStore.getState();
    if (!engine || !transport.isPlaying) return;

    const elapsed = engine.currentTime - playbackStartCtxTime.current;
    let newPos = playbackStartOffset.current + elapsed;

    // Loop wrapping
    if (transport.loopEnabled && transport.loopEnd > transport.loopStart && newPos >= transport.loopEnd) {
      const loopLen = transport.loopEnd - transport.loopStart;
      newPos = transport.loopStart + ((newPos - transport.loopStart) % loopLen);

      // Restart all processors from the wrapped position
      engine.stopPlayback();
      playbackStartOffset.current = newPos;
      playbackStartCtxTime.current = engine.currentTime;
      engine.startPlayback(newPos);
    }

    transport.setPosition(newPos);

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

  // Subscribe to recording state changes
  useEffect(() => {
    const unsubscribe = useRecordingStore.subscribe(
      (state, prev) => {
        const engine = engineRef.current;
        if (!engine || !initializedRef.current) return;

        // Recording started
        if (state.isRecording && !prev.isRecording) {
          handleRecordStart(engine);
        }

        // Recording stopped
        if (!state.isRecording && prev.isRecording) {
          handleRecordStop(engine);
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

/** Set up mic input and start recording on all armed tracks */
async function handleRecordStart(engine: AudioEngine): Promise<void> {
  const ctx = engine.audioContext;
  if (!ctx) return;

  const { armedTrackIds, inputMonitoring } = useRecordingStore.getState();
  if (armedTrackIds.length === 0) return;

  try {
    const micSource = await requestMicInput(ctx);

    // Connect mic to each armed track and start recording
    const position = useTransportStore.getState().position;
    for (const trackId of armedTrackIds) {
      engine.setRecordInput(trackId, micSource, inputMonitoring);
      engine.startRecording(trackId, position);
    }

    // Start transport if not already playing
    if (!useTransportStore.getState().isPlaying) {
      useTransportStore.getState().play();
    }
  } catch (e) {
    console.error('Failed to start recording:', e);
    useRecordingStore.getState().setRecording(false);
  }
}

/** Stop recording, capture buffers, and create regions */
function handleRecordStop(engine: AudioEngine): void {
  const { armedTrackIds, latencyCompensation, manualLatencyOffset } = useRecordingStore.getState();
  const totalCompensation = latencyCompensation + manualLatencyOffset;

  for (const trackId of armedTrackIds) {
    const result = engine.stopRecording(trackId);
    engine.clearRecordInput(trackId);

    if (result && result.buffer.duration > 0.05) {
      // Store the recorded buffer
      const bufferRef = nanoid();
      const peaks = extractPeaks(result.buffer, 200);
      storeBuffer(bufferRef, {
        buffer: result.buffer,
        peaks,
        fileName: `Recording ${new Date().toLocaleTimeString()}`,
        duration: result.buffer.duration,
        channelCount: result.buffer.numberOfChannels,
        sampleRate: result.buffer.sampleRate,
      });

      // Create a region at the recorded position, minus latency compensation
      const compensatedPosition = Math.max(0, result.startOffset - totalCompensation);
      useEditorStore.getState().addRegion({
        trackId,
        bufferRef,
        position: compensatedPosition,
        sourceOffset: 0,
        duration: result.buffer.duration,
        fadeIn: 0.005,
        fadeOut: 0.005,
      });

      // Update track node data to show the recording
      useGraphStore.getState().setNodeData(trackId, {
        bufferRef,
        fileName: `Recording ${new Date().toLocaleTimeString()}`,
        duration: result.buffer.duration,
      });
    }
  }

  disposeMicInput();
}
