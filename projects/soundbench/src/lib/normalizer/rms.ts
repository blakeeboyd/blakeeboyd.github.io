/**
 * Integrated RMS measurement (no weighting, no gating)
 * Returns RMS level in dBFS
 */
export function measureRms(channelData: Float32Array[], _sampleRate: number): number {
  let sumOfSquares = 0;
  let totalSamples = 0;

  for (let ch = 0; ch < channelData.length; ch++) {
    const data = channelData[ch];
    for (let i = 0; i < data.length; i++) {
      sumOfSquares += data[i] * data[i];
    }
    totalSamples += data.length;
  }

  if (totalSamples === 0) return -Infinity;

  const rms = Math.sqrt(sumOfSquares / totalSamples);
  if (rms === 0) return -Infinity;

  return 20 * Math.log10(rms);
}
