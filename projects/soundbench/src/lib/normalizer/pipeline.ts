/**
 * Processing pipeline: measure → normalize → limit → encode
 *
 * Runs inside the Web Worker. Reports progress via callback.
 */

import type { AudioFileMeasurements, ProcessingJobSettings } from '@/types/normalizer';
import { measureLufsI } from './lufs';
import { measureRms } from './rms';
import { measureSamplePeak, measureTruePeak } from './true-peak';
import { applyBrickwallLimiter } from './limiter';
import { encodeWav } from './wav-encoder';

export interface PipelineResult {
  wavBuffer: ArrayBuffer;
  inputMeasurements: AudioFileMeasurements;
  outputMeasurements: AudioFileMeasurements;
  appliedGainDb: number;
}

type ProgressCallback = (percent: number, stage: string) => void;

function measureAll(channelData: Float32Array[], sampleRate: number): AudioFileMeasurements {
  return {
    peakDb: measureSamplePeak(channelData),
    truePeakDb: measureTruePeak(channelData),
    lufsI: measureLufsI(channelData, sampleRate),
    rmsDb: measureRms(channelData, sampleRate),
  };
}

function cloneChannelData(channelData: Float32Array[]): Float32Array[] {
  return channelData.map(ch => new Float32Array(ch));
}

export function runPipeline(
  channelData: Float32Array[],
  sampleRate: number,
  settings: ProcessingJobSettings,
  onProgress: ProgressCallback,
): PipelineResult {
  // Step 1: Measure input
  onProgress(5, 'Measuring input loudness');
  const inputMeasurements = measureAll(channelData, sampleRate);

  // Step 2: Clone data for processing (preserve originals for measurement comparison)
  onProgress(15, 'Preparing audio');
  const processed = cloneChannelData(channelData);

  // Step 3: Calculate and apply normalization gain
  let appliedGainDb = 0;

  if (settings.normalize.enabled) {
    onProgress(25, 'Calculating normalization');

    const { type, targetValue, condition } = settings.normalize;

    // Determine current level based on normalization type
    let currentLevel: number;
    switch (type) {
      case 'lufs-i':
        currentLevel = inputMeasurements.lufsI;
        break;
      case 'rms-i':
        currentLevel = inputMeasurements.rmsDb;
        break;
      case 'peak':
        currentLevel = inputMeasurements.peakDb;
        break;
      case 'true-peak':
        currentLevel = inputMeasurements.truePeakDb;
        break;
      default:
        currentLevel = inputMeasurements.lufsI;
    }

    // Check condition
    let shouldNormalize = true;
    if (condition === 'too-loud' && currentLevel <= targetValue) {
      shouldNormalize = false;
    } else if (condition === 'too-quiet' && currentLevel >= targetValue) {
      shouldNormalize = false;
    }

    if (shouldNormalize && isFinite(currentLevel)) {
      appliedGainDb = targetValue - currentLevel;
      const gainLinear = Math.pow(10, appliedGainDb / 20);

      onProgress(40, 'Applying normalization');
      for (let ch = 0; ch < processed.length; ch++) {
        const data = processed[ch];
        for (let i = 0; i < data.length; i++) {
          data[i] *= gainLinear;
        }
      }
    }
  }

  // Step 4: Apply brickwall limiter
  if (settings.limiter.enabled) {
    onProgress(55, 'Applying limiter');
    applyBrickwallLimiter(processed, sampleRate, settings.limiter.ceiling);
  }

  // Step 5: Measure output
  onProgress(75, 'Measuring output loudness');
  const outputMeasurements = measureAll(processed, sampleRate);

  // Step 6: Encode WAV
  onProgress(85, 'Encoding WAV');
  const wavBuffer = encodeWav(processed, sampleRate, settings.output.bitDepth);

  onProgress(100, 'Complete');

  return {
    wavBuffer,
    inputMeasurements,
    outputMeasurements,
    appliedGainDb,
  };
}
