/**
 * Processing pipeline: measure → normalize → trim → pad → fade → batch limit reduction → limit → mono → measure → encode
 *
 * Runs inside the Web Worker. Reports progress via callback.
 */

import type { AudioFileMeasurements, ProcessingJobSettings } from '@/types/normalizer';
import { measureAllLufs } from './lufs';
import { measureRms } from './rms';
import { measureSamplePeak, measureTruePeak } from './true-peak';
import { trimSilence } from './trim';
import { padSilence } from './pad';
import { applyFades } from './fade';
import { applyBrickwallLimiter } from './limiter';
import { downmixToMono } from './mono';
import { encodeWav } from './wav-encoder';

export interface PipelineResult {
  wavBuffer: ArrayBuffer;
  inputMeasurements: AudioFileMeasurements;
  outputMeasurements: AudioFileMeasurements;
  appliedGainDb: number;
  wavBufferL?: ArrayBuffer;
  wavBufferR?: ArrayBuffer;
}

type ProgressCallback = (percent: number, stage: string) => void;

function measureAll(channelData: Float32Array[], sampleRate: number): AudioFileMeasurements {
  const lufs = measureAllLufs(channelData, sampleRate);
  return {
    peakDb: measureSamplePeak(channelData),
    truePeakDb: measureTruePeak(channelData),
    lufsI: lufs.lufsI,
    lufsMMax: lufs.lufsMMax,
    lufsSMax: lufs.lufsSMax,
    rmsDb: measureRms(channelData, sampleRate),
  };
}

function cloneChannelData(channelData: Float32Array[]): Float32Array[] {
  return channelData.map(ch => new Float32Array(ch));
}

function applyGainLinear(channelData: Float32Array[], gainLinear: number): void {
  for (let ch = 0; ch < channelData.length; ch++) {
    const data = channelData[ch];
    for (let i = 0; i < data.length; i++) {
      data[i] *= gainLinear;
    }
  }
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
  let processed = cloneChannelData(channelData);

  // Step 3: Calculate and apply normalization gain
  let appliedGainDb = 0;

  if (settings.overrideGainDb !== undefined) {
    // Batch mode: gain was pre-computed by the orchestrator
    appliedGainDb = settings.overrideGainDb;
    const gainLinear = Math.pow(10, appliedGainDb / 20);
    onProgress(35, 'Applying normalization');
    applyGainLinear(processed, gainLinear);
  } else if (settings.normalize.enabled) {
    onProgress(25, 'Calculating normalization');

    const { type, targetValue, condition } = settings.normalize;

    // Determine current level based on normalization type
    let currentLevel: number;
    switch (type) {
      case 'lufs-i':
        currentLevel = inputMeasurements.lufsI;
        break;
      case 'lufs-m-max':
        currentLevel = inputMeasurements.lufsMMax;
        break;
      case 'lufs-s-max':
        currentLevel = inputMeasurements.lufsSMax;
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

      onProgress(35, 'Applying normalization');
      applyGainLinear(processed, gainLinear);
    }
  }

  // Step 4: Trim silence
  if (settings.trimFade.trimStart || settings.trimFade.trimEnd) {
    onProgress(42, 'Trimming silence');
    const result = trimSilence(
      processed,
      settings.trimFade.trimStart,
      settings.trimFade.trimEnd,
      settings.trimFade.trimThresholdDb,
    );
    if (result.channelData[0].length === 0) {
      throw new Error('All audio was below the silence threshold');
    }
    processed = result.channelData;
  }

  // Step 5: Pad silence
  if (settings.trimFade.padStartMs > 0 || settings.trimFade.padEndMs > 0) {
    onProgress(46, 'Adding padding');
    processed = padSilence(processed, sampleRate, settings.trimFade.padStartMs, settings.trimFade.padEndMs);
  }

  // Step 6: Apply fades
  if (settings.trimFade.fadeInMs > 0 || settings.trimFade.fadeOutMs > 0) {
    onProgress(50, 'Applying fades');
    applyFades(processed, sampleRate, settings.trimFade.fadeInMs, settings.trimFade.fadeOutMs, settings.trimFade.fadeCurve);
  }

  // Step 6.5: Apply batch limiter reduction (uniform gain to preserve relative levels)
  if (settings.overrideLimiterReduction !== undefined && settings.overrideLimiterReduction < 0) {
    onProgress(55, 'Applying batch limiter reduction');
    const reductionLinear = Math.pow(10, settings.overrideLimiterReduction / 20);
    applyGainLinear(processed, reductionLinear);
  }

  // Step 7: Apply brickwall limiter
  if (settings.limiter.enabled) {
    onProgress(60, 'Applying limiter');
    applyBrickwallLimiter(processed, sampleRate, settings.limiter.ceiling, settings.limiter.type === 'true-peak');
  }

  // Step 8: Mono conversion
  if (settings.output.monoMode === 'downmix' && processed.length > 1) {
    onProgress(70, 'Converting to mono');
    processed = downmixToMono(processed);
  }

  // Step 9: Measure output
  onProgress(80, 'Measuring output loudness');
  const outputMeasurements = measureAll(processed, sampleRate);

  // Step 10: Encode WAV
  onProgress(90, 'Encoding WAV');
  const wavBuffer = encodeWav(processed, sampleRate, settings.output.bitDepth);

  // Step 10.5: Encode split L/R if requested
  let wavBufferL: ArrayBuffer | undefined;
  let wavBufferR: ArrayBuffer | undefined;
  if (settings.output.monoMode === 'split' && processed.length >= 2) {
    onProgress(95, 'Encoding split channels');
    wavBufferL = encodeWav([processed[0]], sampleRate, settings.output.bitDepth);
    wavBufferR = encodeWav([processed[1]], sampleRate, settings.output.bitDepth);
  }

  onProgress(100, 'Complete');

  return {
    wavBuffer,
    inputMeasurements,
    outputMeasurements,
    appliedGainDb,
    wavBufferL,
    wavBufferR,
  };
}
