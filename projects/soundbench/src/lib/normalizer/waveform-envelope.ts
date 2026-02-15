import type { WaveformEnvelope } from '@/types/waveform';

const DEFAULT_BUCKET_COUNT = 2048;

/**
 * Compute a downsampled waveform envelope from multi-channel audio.
 * Produces one min/max pair per bucket across all channels.
 * O(N) single pass over the sample data.
 */
export function computeEnvelope(
  channelData: Float32Array[],
  bucketCount: number = DEFAULT_BUCKET_COUNT,
): WaveformEnvelope {
  const totalSamples = channelData[0]?.length ?? 0;

  if (totalSamples === 0 || channelData.length === 0) {
    return { data: new Float32Array(bucketCount * 2), bucketCount };
  }

  const data = new Float32Array(bucketCount * 2);
  const samplesPerBucket = totalSamples / bucketCount;

  for (let b = 0; b < bucketCount; b++) {
    const start = Math.floor(b * samplesPerBucket);
    const end = Math.floor((b + 1) * samplesPerBucket);

    let min = Infinity;
    let max = -Infinity;

    for (let ch = 0; ch < channelData.length; ch++) {
      const channel = channelData[ch];
      for (let i = start; i < end; i++) {
        const v = channel[i];
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }

    data[b * 2] = min;
    data[b * 2 + 1] = max;
  }

  return { data, bucketCount };
}
