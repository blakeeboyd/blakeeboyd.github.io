/**
 * Encode multichannel Float32Array data as a WAV file (ArrayBuffer)
 * Supports 16-bit (with TPDF dither), 24-bit, and 32-bit float PCM.
 */

import type { BitDepth } from '@/types/normalizer';

export function encodeWav(
  channelData: Float32Array[],
  sampleRate: number,
  bitDepth: BitDepth,
): ArrayBuffer {
  const numChannels = channelData.length;
  const numSamples = channelData[0].length;
  const isFloat = bitDepth === 32;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numSamples * blockAlign;

  // RIFF header (44 bytes) + data
  const bufferSize = 44 + dataSize;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, bufferSize - 8, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // sub-chunk size
  view.setUint16(20, isFloat ? 3 : 1, true); // audio format: 3=float, 1=PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // byte rate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave and write samples
  let offset = 44;

  if (bitDepth === 16) {
    // 16-bit PCM with TPDF dither
    const scale = 32767;
    for (let i = 0; i < numSamples; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const sample = channelData[ch][i];
        // TPDF dither: sum of two uniform random values in [-0.5, 0.5]
        const dither = (Math.random() - 0.5 + Math.random() - 0.5) / scale;
        const clamped = Math.max(-1, Math.min(1, sample + dither));
        view.setInt16(offset, Math.round(clamped * scale), true);
        offset += 2;
      }
    }
  } else if (bitDepth === 24) {
    // 24-bit PCM (no dither needed at this bit depth)
    const scale = 8388607; // 2^23 - 1
    for (let i = 0; i < numSamples; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const sample = channelData[ch][i];
        const clamped = Math.max(-1, Math.min(1, sample));
        const intVal = Math.round(clamped * scale);
        // Write 3 bytes, little-endian
        view.setUint8(offset, intVal & 0xFF);
        view.setUint8(offset + 1, (intVal >> 8) & 0xFF);
        view.setUint8(offset + 2, (intVal >> 16) & 0xFF);
        offset += 3;
      }
    }
  } else {
    // 32-bit float
    for (let i = 0; i < numSamples; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        view.setFloat32(offset, channelData[ch][i], true);
        offset += 4;
      }
    }
  }

  return buffer;
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
