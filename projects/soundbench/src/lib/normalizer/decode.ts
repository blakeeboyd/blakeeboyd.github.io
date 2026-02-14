/**
 * Decode audio files on the main thread using OfflineAudioContext.
 * Returns channel data as Float32Array[] for transfer to worker.
 */

export interface DecodedAudio {
  channelData: Float32Array[];
  sampleRate: number;
  channelCount: number;
  durationSec: number;
}

export async function decodeAudioFile(file: File): Promise<DecodedAudio> {
  const arrayBuffer = await file.arrayBuffer();

  // Use OfflineAudioContext to decode; we need at least 1 sample of output
  // but the context is only used for decoding, not rendering
  const tempCtx = new OfflineAudioContext(1, 1, 44100);
  const audioBuffer = await tempCtx.decodeAudioData(arrayBuffer);

  const channelCount = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const durationSec = audioBuffer.duration;

  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < channelCount; ch++) {
    channelData.push(audioBuffer.getChannelData(ch));
  }

  return { channelData, sampleRate, channelCount, durationSec };
}
