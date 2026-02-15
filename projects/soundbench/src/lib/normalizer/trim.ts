/**
 * Silence detection and trimming.
 *
 * Scans for leading/trailing silence below a dBFS threshold
 * and returns trimmed channel data.
 */

export interface TrimResult {
  /** First non-silent sample (inclusive) */
  startSample: number;
  /** Last non-silent sample + 1 (exclusive) */
  endSample: number;
  /** Samples trimmed from the start */
  trimmedStart: number;
  /** Samples trimmed from the end */
  trimmedEnd: number;
}

/**
 * Detect the boundaries of non-silent audio.
 */
export function detectSilence(
  channelData: Float32Array[],
  thresholdDb: number,
): TrimResult {
  const threshold = Math.pow(10, thresholdDb / 20);
  const numChannels = channelData.length;
  const totalSamples = channelData[0].length;

  // Scan forward for first sample above threshold on any channel
  let startSample = totalSamples;
  for (let i = 0; i < totalSamples; i++) {
    let aboveThreshold = false;
    for (let ch = 0; ch < numChannels; ch++) {
      if (Math.abs(channelData[ch][i]) > threshold) {
        aboveThreshold = true;
        break;
      }
    }
    if (aboveThreshold) {
      startSample = i;
      break;
    }
  }

  // If no sample exceeded threshold, all audio is silent
  if (startSample === totalSamples) {
    return { startSample: 0, endSample: 0, trimmedStart: 0, trimmedEnd: totalSamples };
  }

  // Scan backward for last sample above threshold
  let endSample = 0;
  for (let i = totalSamples - 1; i >= startSample; i--) {
    let aboveThreshold = false;
    for (let ch = 0; ch < numChannels; ch++) {
      if (Math.abs(channelData[ch][i]) > threshold) {
        aboveThreshold = true;
        break;
      }
    }
    if (aboveThreshold) {
      endSample = i + 1; // exclusive
      break;
    }
  }

  return {
    startSample,
    endSample,
    trimmedStart: startSample,
    trimmedEnd: totalSamples - endSample,
  };
}

/**
 * Trim leading and/or trailing silence from channel data.
 * Returns new arrays (does not modify originals).
 */
export function trimSilence(
  channelData: Float32Array[],
  trimStart: boolean,
  trimEnd: boolean,
  thresholdDb: number,
): { channelData: Float32Array[]; trimInfo: TrimResult } {
  const trimInfo = detectSilence(channelData, thresholdDb);
  const totalSamples = channelData[0].length;

  const start = trimStart ? trimInfo.startSample : 0;
  const end = trimEnd ? trimInfo.endSample : totalSamples;

  const trimmed = channelData.map(ch => ch.slice(start, end));

  return { channelData: trimmed, trimInfo };
}
