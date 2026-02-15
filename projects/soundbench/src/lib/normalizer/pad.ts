/**
 * Silence padding: add silence at the start and/or end of audio.
 */

/**
 * Pad channel data with silence.
 * Returns new arrays (does not modify originals).
 */
export function padSilence(
  channelData: Float32Array[],
  sampleRate: number,
  startMs: number,
  endMs: number,
): Float32Array[] {
  const startSamples = Math.round(Math.max(0, startMs) * sampleRate / 1000);
  const endSamples = Math.round(Math.max(0, endMs) * sampleRate / 1000);

  if (startSamples === 0 && endSamples === 0) return channelData;

  const originalLength = channelData[0].length;
  const newLength = startSamples + originalLength + endSamples;

  return channelData.map(ch => {
    const padded = new Float32Array(newLength); // zero-initialized = silence
    padded.set(ch, startSamples);
    return padded;
  });
}
