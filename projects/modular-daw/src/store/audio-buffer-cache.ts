export interface BufferEntry {
  buffer: AudioBuffer;
  peaks: Float32Array;
  fileName: string;
  duration: number;
  channelCount: number;
  sampleRate: number;
}

const cache = new Map<string, BufferEntry>();

export function storeBuffer(id: string, entry: BufferEntry): void {
  cache.set(id, entry);
}

export function getBuffer(id: string): BufferEntry | undefined {
  return cache.get(id);
}

export function removeBuffer(id: string): void {
  cache.delete(id);
}

/**
 * Downsample an AudioBuffer to a fixed number of bins by computing
 * the max absolute sample value within each bin. Averages all channels
 * for a single mono waveform representation.
 */
export function extractPeaks(buffer: AudioBuffer, numBins: number): Float32Array {
  const peaks = new Float32Array(numBins);
  const channels = buffer.numberOfChannels;
  const length = buffer.length;
  const samplesPerBin = length / numBins;

  // Get all channel data up front
  const channelData: Float32Array[] = [];
  for (let c = 0; c < channels; c++) {
    channelData.push(buffer.getChannelData(c));
  }

  for (let i = 0; i < numBins; i++) {
    const start = Math.floor(i * samplesPerBin);
    const end = Math.min(Math.floor((i + 1) * samplesPerBin), length);
    let max = 0;

    for (let j = start; j < end; j++) {
      let sum = 0;
      for (let c = 0; c < channels; c++) {
        sum += Math.abs(channelData[c][j]);
      }
      const avg = sum / channels;
      if (avg > max) max = avg;
    }

    peaks[i] = max;
  }

  return peaks;
}

export interface StereoPeaks {
  left: Float32Array;
  right: Float32Array;
}

/**
 * Extract per-channel peaks for stereo buffers.
 * Returns separate left and right peak arrays.
 * For mono buffers, left and right will be identical.
 */
export function extractStereoPeaks(buffer: AudioBuffer, numBins: number): StereoPeaks {
  const left = new Float32Array(numBins);
  const right = new Float32Array(numBins);
  const length = buffer.length;
  const samplesPerBin = length / numBins;

  const leftData = buffer.getChannelData(0);
  const rightData = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : leftData;

  for (let i = 0; i < numBins; i++) {
    const start = Math.floor(i * samplesPerBin);
    const end = Math.min(Math.floor((i + 1) * samplesPerBin), length);
    let maxL = 0;
    let maxR = 0;

    for (let j = start; j < end; j++) {
      const absL = Math.abs(leftData[j]);
      const absR = Math.abs(rightData[j]);
      if (absL > maxL) maxL = absL;
      if (absR > maxR) maxR = absR;
    }

    left[i] = maxL;
    right[i] = maxR;
  }

  return { left, right };
}
