/** Pre-computed waveform envelope for canvas rendering.
 *  Stores min/max pairs per bucket, interleaved in a single Float32Array. */
export interface WaveformEnvelope {
  /** Interleaved min/max pairs: [min0, max0, min1, max1, ...] */
  data: Float32Array;
  bucketCount: number;
}
