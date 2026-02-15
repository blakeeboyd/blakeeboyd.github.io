/**
 * Mono downmix: sum all channels with equal-power compensation.
 */

/**
 * Downmix multichannel audio to mono.
 * Uses 1/√N compensation (−3 dB for stereo).
 * Returns the input unchanged if already mono.
 */
export function downmixToMono(channelData: Float32Array[]): Float32Array[] {
  if (channelData.length <= 1) return channelData;

  const numChannels = channelData.length;
  const numSamples = channelData[0].length;
  const scale = 1 / Math.sqrt(numChannels);
  const mono = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    let sum = 0;
    for (let ch = 0; ch < numChannels; ch++) {
      sum += channelData[ch][i];
    }
    mono[i] = sum * scale;
  }

  return [mono];
}
