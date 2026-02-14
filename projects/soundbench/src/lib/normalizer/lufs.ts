/**
 * ITU-R BS.1770-4 LUFS measurement
 *
 * K-weighting: two cascaded biquad filters (high shelf + high pass)
 * Gating: 400ms blocks, 75% overlap, absolute gate at -70 LUFS, relative gate at -10 LU
 */

// Biquad filter coefficients for K-weighting
// Computed per ITU-R BS.1770-4 for specific sample rates
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
  // using the analog prototype frequencies from the spec
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

/**
 * Measure LUFS-I (integrated loudness) per ITU-R BS.1770-4
 */
export function measureLufsI(channelData: Float32Array[], sampleRate: number): number {
  const blockDuration = 0.4; // 400ms
  const overlap = 0.75;
  const blockSize = Math.round(blockDuration * sampleRate);
  const hopSize = Math.round(blockSize * (1 - overlap));
  const numChannels = channelData.length;

  // Channel weights: 1.0 for L, R, C; 1.41 for Ls, Rs (surround)
  // For stereo (2ch), both are 1.0
  const channelWeights = numChannels <= 3
    ? new Array(numChannels).fill(1.0)
    : [1.0, 1.0, 1.0, ...new Array(numChannels - 3).fill(1.41)];

  // Apply K-weighting to each channel
  const weighted: Float64Array[] = channelData.map(ch =>
    applyKWeighting(channelToFloat64(ch), sampleRate)
  );

  // Calculate loudness per block
  const totalSamples = channelData[0].length;
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
