/**
 * ITU-R BS.1770-4 LUFS measurement
 *
 * K-weighting: two cascaded biquad filters (high shelf + high pass)
 * Gating: 400ms blocks, 75% overlap, absolute gate at -70 LUFS, relative gate at -10 LU
 *
 * Exports:
 *   measureLufsI    — integrated loudness (gated)
 *   measureLufsMMax — max momentary loudness (ungated, 400ms blocks)
 *   measureLufsSMax — max short-term loudness (ungated, 3000ms blocks)
 *   measureAllLufs  — all three, K-weighting computed once
 */

// Biquad filter coefficients for K-weighting
interface BiquadCoeffs {
  b0: number; b1: number; b2: number;
  a1: number; a2: number;
}

interface KWeightCoeffs {
  shelf: BiquadCoeffs;
  highpass: BiquadCoeffs;
}

function getKWeightCoeffs(sampleRate: number): KWeightCoeffs {
  // Stage 1: High-frequency shelving filter (+4 dB at high frequencies)
  // Stage 2: High-pass filter (RLB weighting, ~38 Hz)
  // Reference coefficients from ITU-R BS.1770-4 for 48kHz
  if (sampleRate === 48000) {
    return {
      shelf: {
        b0: 1.53512485958697,
        b1: -2.69169618940638,
        b2: 1.19839281085285,
        a1: -1.69065929318241,
        a2: 0.73248077421585,
      },
      highpass: {
        b0: 1.0,
        b1: -2.0,
        b2: 1.0,
        a1: -1.99004745483398,
        a2: 0.99007225036621,
      },
    };
  }

  // For other sample rates, compute via bilinear transform
  const shelf = computeHighShelf(sampleRate, 1681.974450955533, 3.999843904948301, 0.7071752369554196);
  const highpass = computeHighPass(sampleRate, 38.13547087602444, 0.5003270373238773);
  return { shelf, highpass };
}

function computeHighShelf(fs: number, fc: number, gainDb: number, Q: number): BiquadCoeffs {
  const A = Math.pow(10, gainDb / 40);
  const w0 = 2 * Math.PI * fc / fs;
  const cosw0 = Math.cos(w0);
  const sinw0 = Math.sin(w0);
  const alpha = sinw0 / (2 * Q);
  const sqrtA = Math.sqrt(A);

  const a0 = (A + 1) - (A - 1) * cosw0 + 2 * sqrtA * alpha;
  return {
    b0: (A * ((A + 1) + (A - 1) * cosw0 + 2 * sqrtA * alpha)) / a0,
    b1: (-2 * A * ((A - 1) + (A + 1) * cosw0)) / a0,
    b2: (A * ((A + 1) + (A - 1) * cosw0 - 2 * sqrtA * alpha)) / a0,
    a1: (2 * ((A - 1) - (A + 1) * cosw0)) / a0,
    a2: ((A + 1) - (A - 1) * cosw0 - 2 * sqrtA * alpha) / a0,
  };
}

function computeHighPass(fs: number, fc: number, Q: number): BiquadCoeffs {
  const w0 = 2 * Math.PI * fc / fs;
  const cosw0 = Math.cos(w0);
  const sinw0 = Math.sin(w0);
  const alpha = sinw0 / (2 * Q);

  const a0 = 1 + alpha;
  return {
    b0: ((1 + cosw0) / 2) / a0,
    b1: (-(1 + cosw0)) / a0,
    b2: ((1 + cosw0) / 2) / a0,
    a1: (-2 * cosw0) / a0,
    a2: (1 - alpha) / a0,
  };
}

function applyBiquad(samples: Float64Array, coeffs: BiquadCoeffs): Float64Array {
  const out = new Float64Array(samples.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;

  for (let i = 0; i < samples.length; i++) {
    const x = samples[i];
    const y = coeffs.b0 * x + coeffs.b1 * x1 + coeffs.b2 * x2
            - coeffs.a1 * y1 - coeffs.a2 * y2;
    out[i] = y;
    x2 = x1; x1 = x;
    y2 = y1; y1 = y;
  }

  return out;
}

function applyKWeighting(samples: Float64Array, sampleRate: number): Float64Array {
  const coeffs = getKWeightCoeffs(sampleRate);
  const afterShelf = applyBiquad(samples, coeffs.shelf);
  return applyBiquad(afterShelf, coeffs.highpass);
}

function channelToFloat64(channel: Float32Array): Float64Array {
  const out = new Float64Array(channel.length);
  for (let i = 0; i < channel.length; i++) {
    out[i] = channel[i];
  }
  return out;
}

// --- Shared helpers ---

function kWeightChannels(channelData: Float32Array[], sampleRate: number): Float64Array[] {
  return channelData.map(ch => applyKWeighting(channelToFloat64(ch), sampleRate));
}

function getChannelWeights(numChannels: number): number[] {
  return numChannels <= 3
    ? new Array(numChannels).fill(1.0)
    : [1.0, 1.0, 1.0, ...new Array(numChannels - 3).fill(1.41)];
}

/**
 * Compute per-block loudness values (ungated) for a given block size and hop size.
 */
function computeBlockLoudnesses(
  weighted: Float64Array[],
  channelWeights: number[],
  blockSize: number,
  hopSize: number,
): number[] {
  const numChannels = weighted.length;
  const totalSamples = weighted[0].length;
  const blockLoudnesses: number[] = [];

  for (let start = 0; start + blockSize <= totalSamples; start += hopSize) {
    let sumPower = 0;

    for (let ch = 0; ch < numChannels; ch++) {
      let channelPower = 0;
      const data = weighted[ch];
      for (let i = start; i < start + blockSize; i++) {
        channelPower += data[i] * data[i];
      }
      channelPower /= blockSize;
      sumPower += channelWeights[ch] * channelPower;
    }

    const loudness = -0.691 + 10 * Math.log10(sumPower);
    blockLoudnesses.push(loudness);
  }

  return blockLoudnesses;
}

/**
 * Apply two-stage gating (absolute at -70 LUFS, relative at -10 LU)
 * to block loudnesses and return integrated loudness.
 */
function integrateWithGating(blockLoudnesses: number[]): number {
  if (blockLoudnesses.length === 0) return -Infinity;

  // Absolute gate: discard blocks below -70 LUFS
  const absoluteGated = blockLoudnesses.filter(l => l >= -70);
  if (absoluteGated.length === 0) return -Infinity;

  // Calculate mean of absolute-gated blocks (in power domain)
  const absoluteMeanPower = absoluteGated.reduce(
    (sum, l) => sum + Math.pow(10, (l + 0.691) / 10), 0
  ) / absoluteGated.length;
  const absoluteMean = -0.691 + 10 * Math.log10(absoluteMeanPower);

  // Relative gate: discard blocks below (absoluteMean - 10 LU)
  const relativeThreshold = absoluteMean - 10;
  const relativeGated = absoluteGated.filter(l => l >= relativeThreshold);
  if (relativeGated.length === 0) return -Infinity;

  // Final integrated loudness
  const finalPower = relativeGated.reduce(
    (sum, l) => sum + Math.pow(10, (l + 0.691) / 10), 0
  ) / relativeGated.length;

  return -0.691 + 10 * Math.log10(finalPower);
}

// --- Public API ---

/**
 * Measure LUFS-I (integrated loudness) per ITU-R BS.1770-4
 */
export function measureLufsI(channelData: Float32Array[], sampleRate: number): number {
  const blockSize = Math.round(0.4 * sampleRate);
  const hopSize = Math.round(blockSize * 0.25);

  const weighted = kWeightChannels(channelData, sampleRate);
  const channelWeights = getChannelWeights(channelData.length);
  const blockLoudnesses = computeBlockLoudnesses(weighted, channelWeights, blockSize, hopSize);

  return integrateWithGating(blockLoudnesses);
}

/**
 * Measure LUFS-M max (maximum momentary loudness).
 * Ungated max of 400ms blocks.
 */
export function measureLufsMMax(channelData: Float32Array[], sampleRate: number): number {
  const blockSize = Math.round(0.4 * sampleRate);
  const hopSize = Math.round(blockSize * 0.25);

  const weighted = kWeightChannels(channelData, sampleRate);
  const channelWeights = getChannelWeights(channelData.length);
  const blockLoudnesses = computeBlockLoudnesses(weighted, channelWeights, blockSize, hopSize);

  if (blockLoudnesses.length === 0) return -Infinity;
  return Math.max(...blockLoudnesses);
}

/**
 * Measure LUFS-S max (maximum short-term loudness).
 * Ungated max of 3000ms blocks with 100ms hop.
 */
export function measureLufsSMax(channelData: Float32Array[], sampleRate: number): number {
  const blockSize = Math.round(3.0 * sampleRate);
  const hopSize = Math.round(0.1 * sampleRate);

  const weighted = kWeightChannels(channelData, sampleRate);
  const channelWeights = getChannelWeights(channelData.length);
  const blockLoudnesses = computeBlockLoudnesses(weighted, channelWeights, blockSize, hopSize);

  if (blockLoudnesses.length === 0) return -Infinity;
  return Math.max(...blockLoudnesses);
}

/**
 * Compute all three LUFS values with a single K-weighting pass.
 */
export function measureAllLufs(
  channelData: Float32Array[],
  sampleRate: number,
): { lufsI: number; lufsMMax: number; lufsSMax: number } {
  const weighted = kWeightChannels(channelData, sampleRate);
  const channelWeights = getChannelWeights(channelData.length);

  // LUFS-I and LUFS-M both use 400ms blocks, 100ms hop (75% overlap)
  const mBlockSize = Math.round(0.4 * sampleRate);
  const mHopSize = Math.round(mBlockSize * 0.25);
  const mBlocks = computeBlockLoudnesses(weighted, channelWeights, mBlockSize, mHopSize);

  const lufsI = integrateWithGating(mBlocks);
  const lufsMMax = mBlocks.length === 0 ? -Infinity : Math.max(...mBlocks);

  // LUFS-S uses 3000ms blocks, 100ms hop
  const sBlockSize = Math.round(3.0 * sampleRate);
  const sHopSize = Math.round(0.1 * sampleRate);
  const sBlocks = computeBlockLoudnesses(weighted, channelWeights, sBlockSize, sHopSize);
  const lufsSMax = sBlocks.length === 0 ? -Infinity : Math.max(...sBlocks);

  return { lufsI, lufsMMax, lufsSMax };
}
