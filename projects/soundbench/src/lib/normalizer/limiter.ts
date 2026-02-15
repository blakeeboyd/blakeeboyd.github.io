/**
 * Lookahead brickwall limiter for offline processing
 *
 * Uses a lookahead buffer to detect peaks before they arrive,
 * applying smooth gain reduction to keep output below the ceiling.
 */

import { computeTruePeakEnvelope } from './true-peak';

/**
 * Apply brickwall limiting to multichannel audio in place.
 * Modifies the channelData arrays directly.
 *
 * @param channelData - Array of Float32Array per channel (modified in place)
 * @param sampleRate - Sample rate in Hz
 * @param ceilingDb - Maximum output level in dBFS (e.g., -1.0)
 * @param useTruePeak - When true, uses 4x oversampled peak detection
 */
export function applyBrickwallLimiter(
  channelData: Float32Array[],
  sampleRate: number,
  ceilingDb: number,
  useTruePeak?: boolean,
): void {
  const ceiling = Math.pow(10, ceilingDb / 20);
  const numChannels = channelData.length;
  const numSamples = channelData[0].length;

  // Lookahead: 5ms
  const lookaheadSamples = Math.round(0.005 * sampleRate);
  // Release: 100ms time constant
  const releaseCoeff = 1.0 - Math.exp(-1.0 / (0.1 * sampleRate));

  // Compute peak envelope across all channels
  let peakEnv: Float32Array;

  if (useTruePeak) {
    // 4x oversampled true peak detection
    peakEnv = computeTruePeakEnvelope(channelData);
  } else {
    // Simple sample peak detection
    peakEnv = new Float32Array(numSamples);
    for (let i = 0; i < numSamples; i++) {
      let maxAbs = 0;
      for (let ch = 0; ch < numChannels; ch++) {
        const abs = Math.abs(channelData[ch][i]);
        if (abs > maxAbs) maxAbs = abs;
      }
      peakEnv[i] = maxAbs;
    }
  }

  // Compute gain reduction curve with lookahead
  const gainCurve = new Float32Array(numSamples);
  gainCurve.fill(1.0);

  // Forward pass: look ahead to find upcoming peaks
  let currentGain = 1.0;

  for (let i = 0; i < numSamples; i++) {
    // Find maximum peak in lookahead window
    let maxPeak = 0;
    const end = Math.min(i + lookaheadSamples, numSamples);
    for (let j = i; j < end; j++) {
      if (peakEnv[j] > maxPeak) maxPeak = peakEnv[j];
    }

    // Target gain to keep peaks below ceiling
    const targetGain = maxPeak > ceiling ? ceiling / maxPeak : 1.0;

    // Instant attack, smooth release
    if (targetGain < currentGain) {
      currentGain = targetGain;
    } else {
      currentGain += (targetGain - currentGain) * releaseCoeff;
    }

    gainCurve[i] = currentGain;
  }

  // Backward pass: smooth the gain curve to prevent the limiter
  // from releasing too early (the lookahead guarantees we know about upcoming peaks)
  currentGain = 1.0;
  for (let i = numSamples - 1; i >= 0; i--) {
    if (gainCurve[i] < currentGain) {
      currentGain = gainCurve[i];
    } else {
      currentGain += (gainCurve[i] - currentGain) * releaseCoeff;
    }
    gainCurve[i] = Math.min(gainCurve[i], currentGain);
  }

  // Apply gain curve to all channels
  for (let ch = 0; ch < numChannels; ch++) {
    const data = channelData[ch];
    for (let i = 0; i < numSamples; i++) {
      data[i] *= gainCurve[i];
    }
  }
}
