import { extractPeaks, extractStereoPeaks } from '../store/audio-buffer-cache';
import type { StereoPeaks } from '../store/audio-buffer-cache';

interface CachedPeaks {
  /** Number of bins (peaks array length) */
  numBins: number;
  peaks: Float32Array;
}

interface CachedStereoPeaks {
  numBins: number;
  peaks: StereoPeaks;
}

/** Cache keyed by bufferRef, storing multiple resolutions */
const cache = new Map<string, CachedPeaks[]>();
const stereoCache = new Map<string, CachedStereoPeaks[]>();

/**
 * Get peaks data at an appropriate resolution for the current zoom level.
 * Computes and caches peaks on first request for each zoom tier.
 *
 * @param bufferRef Key into the audio buffer cache
 * @param zoom Pixels per second
 * @param buffer The AudioBuffer to extract peaks from
 * @param durationSec Buffer duration in seconds
 * @returns Float32Array of peak values
 */
export function getPeaksForZoom(
  bufferRef: string,
  zoom: number,
  buffer: AudioBuffer,
  durationSec: number,
): Float32Array {
  // Desired bins = visible duration in pixels / 1 pixel per peak
  // But we want enough bins for the full buffer at this zoom
  const desiredBins = Math.ceil(durationSec * zoom);
  // Clamp to reasonable range
  const numBins = Math.max(100, Math.min(desiredBins, buffer.length));

  let entries = cache.get(bufferRef);
  if (!entries) {
    entries = [];
    cache.set(bufferRef, entries);
  }

  // Find closest cached resolution
  let best: CachedPeaks | null = null;
  let bestDiff = Infinity;
  for (const entry of entries) {
    const diff = Math.abs(entry.numBins - numBins);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = entry;
    }
  }

  // Use cached if within 50% of desired resolution
  if (best && bestDiff / numBins < 0.5) {
    return best.peaks;
  }

  // Compute new peaks
  const peaks = extractPeaks(buffer, numBins);
  entries.push({ numBins, peaks });

  // Keep cache bounded: max 5 resolutions per buffer
  if (entries.length > 5) {
    entries.shift();
  }

  return peaks;
}

/**
 * Get stereo peaks data at an appropriate resolution for the current zoom level.
 * Returns separate left and right channel peaks for stereo display.
 */
export function getStereoPeaksForZoom(
  bufferRef: string,
  zoom: number,
  buffer: AudioBuffer,
  durationSec: number,
): StereoPeaks {
  const desiredBins = Math.ceil(durationSec * zoom);
  const numBins = Math.max(100, Math.min(desiredBins, buffer.length));

  let entries = stereoCache.get(bufferRef);
  if (!entries) {
    entries = [];
    stereoCache.set(bufferRef, entries);
  }

  let best: CachedStereoPeaks | null = null;
  let bestDiff = Infinity;
  for (const entry of entries) {
    const diff = Math.abs(entry.numBins - numBins);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = entry;
    }
  }

  if (best && bestDiff / numBins < 0.5) {
    return best.peaks;
  }

  const peaks = extractStereoPeaks(buffer, numBins);
  entries.push({ numBins, peaks });

  if (entries.length > 5) {
    entries.shift();
  }

  return peaks;
}

/** Clear cache for a specific buffer (call on buffer removal) */
export function clearPeaksCache(bufferRef: string): void {
  cache.delete(bufferRef);
  stereoCache.delete(bufferRef);
}

/** Clear entire cache */
export function clearAllPeaksCache(): void {
  cache.clear();
  stereoCache.clear();
}
