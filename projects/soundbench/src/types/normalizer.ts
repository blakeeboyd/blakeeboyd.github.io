// === Normalization ===

export type NormalizationType =
  | 'lufs-i'
  | 'peak'
  | 'true-peak'
  | 'rms-i'
  | 'lufs-m-max'
  | 'lufs-s-max';

export type NormalizeCondition = 'always' | 'too-loud' | 'too-quiet';

export type BatchNormMode = 'each' | 'loudest' | 'album';

// === Limiting ===

export type LimitType = 'peak' | 'true-peak';

export type BatchLimitMode = 'each' | 'together';

// === Trim & Fade ===

export type FadeCurve = 'linear' | 'equal-power' | 'logarithmic' | 's-curve';

export interface TrimFadeSettings {
  trimStart: boolean;
  trimEnd: boolean;
  trimThresholdDb: number;
  padStartMs: number;
  padEndMs: number;
  fadeInMs: number;
  fadeOutMs: number;
  fadeCurve: FadeCurve;
}

// === Output ===

export type BitDepth = 16 | 24 | 32;

export type MonoMode = 'off' | 'downmix' | 'split';

// === Processing Settings ===

export interface NormalizeSettings {
  enabled: boolean;
  type: NormalizationType;
  targetValue: number; // dB or LUFS depending on type
  condition: NormalizeCondition;
  batchMode: BatchNormMode;
}

export interface LimiterSettings {
  enabled: boolean;
  type: LimitType;
  ceiling: number; // dBFS or dBTP
  batchMode: BatchLimitMode;
}

export interface OutputSettings {
  bitDepth: BitDepth;
  filenameSuffix: string;
  monoMode: MonoMode;
}

// === Audio File State ===

export type FileStatus = 'pending' | 'decoding' | 'ready' | 'processing' | 'done' | 'error';

export interface AudioFileMeasurements {
  peakDb: number;
  truePeakDb: number;
  lufsI: number;
  lufsMMax: number;
  lufsSMax: number;
  rmsDb: number;
}

export interface AudioFileEntry {
  id: string;
  file: File;
  name: string;
  status: FileStatus;
  error?: string;
  sampleRate?: number;
  channelCount?: number;
  durationSec?: number;
  inputMeasurements?: AudioFileMeasurements;
  outputMeasurements?: AudioFileMeasurements;
  outputBuffer?: ArrayBuffer;
  outputBufferL?: ArrayBuffer;
  outputBufferR?: ArrayBuffer;
  appliedGainDb?: number;
  progress: number;
}

// === Presets ===

export interface PresetSettings {
  normalize: NormalizeSettings;
  trimFade: TrimFadeSettings;
  limiter: LimiterSettings;
  output: OutputSettings;
}

export interface Preset {
  id: string;
  name: string;
  builtIn: boolean;
  settings: PresetSettings;
}

// === Worker Messages ===

export interface ProcessingJobSettings {
  normalize: NormalizeSettings;
  trimFade: TrimFadeSettings;
  limiter: LimiterSettings;
  output: OutputSettings;
  overrideGainDb?: number;
  overrideLimiterReduction?: number;
}

export type WorkerRequest =
  | { type: 'measure'; fileId: string; channelData: Float32Array[]; sampleRate: number }
  | { type: 'process'; fileId: string; channelData: Float32Array[]; sampleRate: number; settings: ProcessingJobSettings };

export type WorkerResponse =
  | { type: 'measurements'; fileId: string; measurements: AudioFileMeasurements }
  | { type: 'progress'; fileId: string; percent: number; stage: string }
  | { type: 'result'; fileId: string; wavBuffer: ArrayBuffer; measurements: AudioFileMeasurements; appliedGainDb: number; wavBufferL?: ArrayBuffer; wavBufferR?: ArrayBuffer }
  | { type: 'error'; fileId: string; message: string };
