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

      dispose() {
        stopPlayback();
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
