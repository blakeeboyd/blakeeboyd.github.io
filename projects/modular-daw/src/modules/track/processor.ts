import type { ProcessorFactory, ProcessorInstance } from '../../types/audio';
import type { Region } from '../../types/region';
import { dbToLinear } from '../../audio/engine';
import { getBuffer } from '../../store/audio-buffer-cache';

interface ActiveSource {
  source: AudioBufferSourceNode;
  fadeGain: GainNode;
}

export const trackFactory: ProcessorFactory = {
  create(ctx: AudioContext, params: Record<string, number>): ProcessorInstance {
    const gainNode = ctx.createGain();
    gainNode.gain.value = dbToLinear(params.volume ?? 0);
    // Stereo output
    gainNode.channelCount = 2;
    gainNode.channelCountMode = 'explicit';

    let regions: Region[] = [];
    let activeSources: ActiveSource[] = [];

    // Recording state
    let recordSource: AudioNode | null = null;
    let monitorGain: GainNode | null = null;
    let scriptProcessor: ScriptProcessorNode | null = null;
    let recordingChunks: Float32Array[] = [];
    let isRecording = false;
    let recordStartOffset = 0;
    const RECORD_BUFFER_SIZE = 4096;

    function stopPlayback() {
      for (const { source, fadeGain } of activeSources) {
        try { source.stop(); } catch { /* already stopped */ }
        source.disconnect();
        fadeGain.disconnect();
      }
      activeSources = [];
    }

    function schedulePlayback(startTime: number, offset: number) {
      stopPlayback();

      // Schedule each region that overlaps or starts after the playback offset
      for (const region of regions) {
        const regionEnd = region.position + region.duration;

        // Skip regions that ended before our offset
        if (regionEnd <= offset) continue;

        const entry = getBuffer(region.bufferRef);
        if (!entry) continue;

        const source = ctx.createBufferSource();
        source.buffer = entry.buffer;

        // Fade gain for micro-crossfades
        const fadeGain = ctx.createGain();
        source.connect(fadeGain);
        fadeGain.connect(gainNode);

        // Calculate timing
        let when: number;
        let sourceOffset: number;
        let duration: number;

        if (offset >= region.position) {
          // Playback starts partway through this region
          when = startTime;
          const intoRegion = offset - region.position;
          sourceOffset = region.sourceOffset + intoRegion;
          duration = region.duration - intoRegion;
        } else {
          // Region starts after current offset
          when = startTime + (region.position - offset);
          sourceOffset = region.sourceOffset;
          duration = region.duration;
        }

        // Clamp duration to buffer length
        const maxDuration = entry.buffer.duration - sourceOffset;
        duration = Math.min(duration, maxDuration);
        if (duration <= 0) continue;

        // Apply fade envelope
        applyFadeEnvelope(ctx, fadeGain, when, duration, region.fadeIn, region.fadeOut);

        source.start(when, sourceOffset, duration);
        activeSources.push({ source, fadeGain });
      }
    }

    return {
      inputs: {},
      outputs: { out: gainNode },

      setParameter(id, value, time) {
        if (id === 'volume') {
          gainNode.gain.setTargetAtTime(dbToLinear(value), time, 0.02);
        }
      },

      setBuffer(_buffer: AudioBuffer) {
        // No-op: region-based playback uses getBuffer() per region
      },

      setRegions(newRegions: Region[]) {
        regions = newRegions;
      },

      schedulePlayback,
      stopPlayback,

      setRecordInput(source: AudioNode, monitoring: boolean) {
        // Clear any previous input
        if (scriptProcessor) {
          try { scriptProcessor.disconnect(); } catch { /* ok */ }
          scriptProcessor = null;
        }
        if (monitorGain) {
          try { monitorGain.disconnect(); } catch { /* ok */ }
          monitorGain = null;
        }

        recordSource = source;

        // ScriptProcessorNode for capture
        scriptProcessor = ctx.createScriptProcessor(RECORD_BUFFER_SIZE, 1, 1);
        scriptProcessor.onaudioprocess = (e) => {
          if (!isRecording) return;
          // Copy the input data (it gets reused by the browser)
          const input = e.inputBuffer.getChannelData(0);
          recordingChunks.push(new Float32Array(input));
          // Pass-through silence so the node stays active
          e.outputBuffer.getChannelData(0).fill(0);
        };

        source.connect(scriptProcessor);
        scriptProcessor.connect(ctx.destination); // ScriptProcessor must be connected to stay alive

        // Monitor path
        monitorGain = ctx.createGain();
        monitorGain.gain.value = monitoring ? 1 : 0;
        source.connect(monitorGain);
        monitorGain.connect(gainNode);
      },

      clearRecordInput() {
        if (scriptProcessor) {
          try { scriptProcessor.disconnect(); } catch { /* ok */ }
          if (recordSource) {
            try { recordSource.disconnect(scriptProcessor); } catch { /* ok */ }
          }
          scriptProcessor = null;
        }
        if (monitorGain) {
          try { monitorGain.disconnect(); } catch { /* ok */ }
          if (recordSource) {
            try { recordSource.disconnect(monitorGain); } catch { /* ok */ }
          }
          monitorGain = null;
        }
        recordSource = null;
      },

      startRecording(_startTime: number, offset: number) {
        recordingChunks = [];
        recordStartOffset = offset;
        isRecording = true;
      },

      stopRecording(): { buffer: AudioBuffer; startOffset: number } | null {
        isRecording = false;
        if (recordingChunks.length === 0) return null;

        // Stitch chunks into a single AudioBuffer
        const totalSamples = recordingChunks.reduce((sum, c) => sum + c.length, 0);
        const buffer = ctx.createBuffer(1, totalSamples, ctx.sampleRate);
        const channelData = buffer.getChannelData(0);
        let writePos = 0;
        for (const chunk of recordingChunks) {
          channelData.set(chunk, writePos);
          writePos += chunk.length;
        }
        recordingChunks = [];

        return { buffer, startOffset: recordStartOffset };
      },

      dispose() {
        stopPlayback();
        if (scriptProcessor) {
          try { scriptProcessor.disconnect(); } catch { /* ok */ }
        }
        if (monitorGain) {
          try { monitorGain.disconnect(); } catch { /* ok */ }
        }
        gainNode.disconnect();
      },
    };
  },
};

function applyFadeEnvelope(
  _ctx: AudioContext,
  fadeGain: GainNode,
  when: number,
  duration: number,
  fadeIn: number,
  fadeOut: number,
): void {
  // Fade in
  if (fadeIn > 0.001) {
    fadeGain.gain.setValueAtTime(0, when);
    fadeGain.gain.linearRampToValueAtTime(1, when + fadeIn);
  } else {
    fadeGain.gain.setValueAtTime(1, when);
  }

  // Fade out
  if (fadeOut > 0.001) {
    const fadeOutStart = when + duration - fadeOut;
    if (fadeOutStart > when + fadeIn) {
      fadeGain.gain.setValueAtTime(1, fadeOutStart);
      fadeGain.gain.linearRampToValueAtTime(0, when + duration);
    }
  }
}
