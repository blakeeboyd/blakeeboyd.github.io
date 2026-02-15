/**
 * True Peak measurement per ITU-R BS.1770-4 Annex 2
 *
 * 4x oversampling with polyphase FIR interpolation filter.
 * Also provides simple sample peak measurement.
 */

/**
 * Measure sample peak across all channels
 * Returns peak level in dBFS
 */
export function measureSamplePeak(channelData: Float32Array[]): number {
  let maxAbs = 0;

  for (let ch = 0; ch < channelData.length; ch++) {
    const data = channelData[ch];
    for (let i = 0; i < data.length; i++) {
      const abs = Math.abs(data[i]);
      if (abs > maxAbs) maxAbs = abs;
    }
  }

  if (maxAbs === 0) return -Infinity;
  return 20 * Math.log10(maxAbs);
}

// 4-phase polyphase FIR coefficients for 4x oversampling
// Derived from ITU-R BS.1770-4 Annex 2 (48-tap filter, 12 taps per phase)
const PHASE_COEFFS: readonly number[][] = [
  // Phase 0 (original sample positions)
  [0.0017089843750, 0.0109863281250, -0.0196533203125, 0.0332031250000,
   -0.0594482421875, 0.1373291015625, 0.9721679687500, -0.1022949218750,
    0.0476074218750, -0.0266113281250, 0.0148925781250, -0.0083007812500],
  // Phase 1
  [-0.0291748046875, 0.0292968750000, -0.0517578125000, 0.0891113281250,
   -0.1665039062500, 0.4650878906250, 0.7797851562500, -0.2003173828125,
    0.1015625000000, -0.0582275390625, 0.0330810546875, -0.0189208984375],
  // Phase 2
  [-0.0189208984375, 0.0330810546875, -0.0582275390625, 0.1015625000000,
   -0.2003173828125, 0.7797851562500, 0.4650878906250, -0.1665039062500,
    0.0891113281250, -0.0517578125000, 0.0292968750000, -0.0291748046875],
  // Phase 3
  [-0.0083007812500, 0.0148925781250, -0.0266113281250, 0.0476074218750,
   -0.1022949218750, 0.9721679687500, 0.1373291015625, -0.0594482421875,
    0.0332031250000, -0.0196533203125, 0.0109863281250, 0.0017089843750],
];

const FILTER_ORDER = 12; // taps per phase

/**
 * Compute a per-sample true peak envelope across all channels.
 * For each sample position, returns the max absolute value across all 4
 * polyphase phases and all channels. Used by the limiter for true-peak mode.
 */
export function computeTruePeakEnvelope(channelData: Float32Array[]): Float32Array {
  const numSamples = channelData[0].length;
  const envelope = new Float32Array(numSamples);

  for (let ch = 0; ch < channelData.length; ch++) {
    const data = channelData[ch];
    const len = data.length;

    for (let i = 0; i < len; i++) {
      let maxAtSample = 0;

      for (let phase = 0; phase < 4; phase++) {
        const coeffs = PHASE_COEFFS[phase];
        let sum = 0;

        for (let k = 0; k < FILTER_ORDER; k++) {
          const idx = i - k;
          if (idx >= 0 && idx < len) {
            sum += data[idx] * coeffs[k];
          }
        }

        const abs = Math.abs(sum);
        if (abs > maxAtSample) maxAtSample = abs;
      }

      if (maxAtSample > envelope[i]) envelope[i] = maxAtSample;
    }
  }

  return envelope;
}

/**
 * Measure true peak across all channels using 4x oversampling
 * Returns true peak level in dBTP
 */
export function measureTruePeak(channelData: Float32Array[]): number {
  let maxAbs = 0;

  for (let ch = 0; ch < channelData.length; ch++) {
    const data = channelData[ch];
    const len = data.length;

    // For each original sample, compute 4 interpolated values
    for (let i = 0; i < len; i++) {
      for (let phase = 0; phase < 4; phase++) {
        const coeffs = PHASE_COEFFS[phase];
        let sum = 0;

        for (let k = 0; k < FILTER_ORDER; k++) {
          const idx = i - k;
          if (idx >= 0 && idx < len) {
            sum += data[idx] * coeffs[k];
          }
        }

        const abs = Math.abs(sum);
        if (abs > maxAbs) maxAbs = abs;
      }
    }
  }

  if (maxAbs === 0) return -Infinity;
  return 20 * Math.log10(maxAbs);
}
