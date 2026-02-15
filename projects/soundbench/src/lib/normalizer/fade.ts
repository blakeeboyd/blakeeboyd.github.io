/**
 * Fade in/out with configurable curve shapes.
 * Applied in-place to all channels.
 */

import type { FadeCurve } from '@/types/normalizer';

/**
 * Generate a gain curve for a fade.
 * Returns values from 0 to 1 (fade in) or 1 to 0 (fade out).
 */
function generateFadeCurve(numSamples: number, curve: FadeCurve, fadeIn: boolean): Float32Array {
  const gains = new Float32Array(numSamples);
  if (numSamples <= 1) {
    gains[0] = fadeIn ? 1 : 0;
    return gains;
  }

  for (let i = 0; i < numSamples; i++) {
    // t goes 0→1 for fade-in, 1→0 for fade-out
    const t = fadeIn ? i / (numSamples - 1) : 1 - i / (numSamples - 1);

    let gain: number;
    switch (curve) {
      case 'linear':
        gain = t;
        break;
      case 'equal-power':
        gain = Math.sin(t * Math.PI / 2);
        break;
      case 'logarithmic':
        gain = Math.pow(t, 0.25);
        break;
      case 's-curve':
        gain = t * t * (3 - 2 * t); // smoothstep
        break;
      default:
        gain = t;
    }

    gains[i] = gain;
  }

  return gains;
}

/**
 * Apply fade in and/or fade out to multichannel audio in place.
 *
 * If the total fade length exceeds the audio length,
 * both fades are scaled proportionally to fit.
 */
export function applyFades(
  channelData: Float32Array[],
  sampleRate: number,
  fadeInMs: number,
  fadeOutMs: number,
  curve: FadeCurve,
): void {
  const totalSamples = channelData[0].length;
  if (totalSamples === 0) return;

  let fadeInSamples = Math.round(Math.max(0, fadeInMs) * sampleRate / 1000);
  let fadeOutSamples = Math.round(Math.max(0, fadeOutMs) * sampleRate / 1000);

  // Scale proportionally if fades overlap
  const totalFade = fadeInSamples + fadeOutSamples;
  if (totalFade > totalSamples) {
    const scale = totalSamples / totalFade;
    fadeInSamples = Math.round(fadeInSamples * scale);
    fadeOutSamples = totalSamples - fadeInSamples;
  }

  // Apply fade in
  if (fadeInSamples > 0) {
    const curve_ = generateFadeCurve(fadeInSamples, curve, true);
    for (let ch = 0; ch < channelData.length; ch++) {
      const data = channelData[ch];
      for (let i = 0; i < fadeInSamples; i++) {
        data[i] *= curve_[i];
      }
    }
  }

  // Apply fade out
  if (fadeOutSamples > 0) {
    const curve_ = generateFadeCurve(fadeOutSamples, curve, false);
    const startIdx = totalSamples - fadeOutSamples;
    for (let ch = 0; ch < channelData.length; ch++) {
      const data = channelData[ch];
      for (let i = 0; i < fadeOutSamples; i++) {
        data[startIdx + i] *= curve_[i];
      }
    }
  }
}
