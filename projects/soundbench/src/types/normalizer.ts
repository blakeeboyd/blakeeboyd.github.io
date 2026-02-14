// === Normalization ===

export type NormalizationType =
  | 'lufs-i'
  | 'peak'
  | 'true-peak'
  | 'rms-i'
  | 'lufs-m-max'
  | 'lufs-s-max';

export type NormalizeCondition = 'always' | 'too-loud' | 'too-quiet';

// === Limiting ===

export type LimitType = 'peak' | 'true-peak';

// === Output ===

export type BitDepth = 16 | 24 | 32;

// === Processing Settings ===

export interface NormalizeSettings {
  enabled: boolean;
  type: NormalizationType;
  targetValue: number; // dB or LUFS depending on type
  condition: NormalizeCondition;
}

export interface LimiterSettings {
  enabled: boolean;
  type: LimitType;
  ceiling: number; // dBFS or dBTP
}

export interface OutputSettings {
  bitDepth: BitDepth;
  filenameSuffix: string;
}

// === Audio File State ===

export type FileStatus = 'pending' | 'decoding' | 'ready' | 'processing' | 'done' | 'error';

export interface AudioFileMeasurements {
  peakDb: number;
  truePeakDb: number;
  lufsI: number;
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
  appliedGainDb?: number;
  progress: number;
}

// === Worker Messages ===

export interface ProcessingJobSettings {
  normalize: NormalizeSettings;
  limiter: LimiterSettings;
  output: OutputSettings;
}

export type WorkerRequest =
  | { type: 'measure'; fileId: string; channelData: Float32Array[]; sampleRate: number }
  | { type: 'process'; fileId: string; channelData: Float32Array[]; sampleRate: number; settings: ProcessingJobSettings };

export type WorkerResponse =
  | { type: 'measurements'; fileId: string; measurements: AudioFileMeasurements }
  | { type: 'progress'; fileId: string; percent: number; stage: string }
  | { type: 'result'; fileId: string; wavBuffer: ArrayBuffer; measurements: AudioFileMeasurements; appliedGainDb: number }
  | { type: 'error'; fileId: string; message: string };
