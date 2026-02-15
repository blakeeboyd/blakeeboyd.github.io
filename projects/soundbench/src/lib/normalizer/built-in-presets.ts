import type { Preset } from '@/types/normalizer';

export const BUILT_IN_PRESETS: Preset[] = [
  {
    id: '__builtin_streaming',
    name: 'Streaming (-14 LUFS)',
    builtIn: true,
    settings: {
      normalize: {
        enabled: true,
        type: 'lufs-i',
        targetValue: -14,
        condition: 'always',
        batchMode: 'each',
      },
      trimFade: {
        trimStart: false,
        trimEnd: false,
        trimThresholdDb: -60,
        padStartMs: 0,
        padEndMs: 0,
        fadeInMs: 0,
        fadeOutMs: 0,
        fadeCurve: 'linear',
      },
      limiter: {
        enabled: true,
        type: 'true-peak',
        ceiling: -1,
        batchMode: 'each',
      },
      output: {
        bitDepth: 24,
        filenameSuffix: '_normalized',
        monoMode: 'off',
      },
    },
  },
  {
    id: '__builtin_broadcast',
    name: 'Broadcast (-24 LUFS)',
    builtIn: true,
    settings: {
      normalize: {
        enabled: true,
        type: 'lufs-i',
        targetValue: -24,
        condition: 'always',
        batchMode: 'each',
      },
      trimFade: {
        trimStart: false,
        trimEnd: false,
        trimThresholdDb: -60,
        padStartMs: 0,
        padEndMs: 0,
        fadeInMs: 0,
        fadeOutMs: 0,
        fadeCurve: 'linear',
      },
      limiter: {
        enabled: true,
        type: 'true-peak',
        ceiling: -2,
        batchMode: 'each',
      },
      output: {
        bitDepth: 24,
        filenameSuffix: '_broadcast',
        monoMode: 'off',
      },
    },
  },
  {
    id: '__builtin_cd_mastering',
    name: 'CD Mastering (0 dBTP)',
    builtIn: true,
    settings: {
      normalize: {
        enabled: false,
        type: 'lufs-i',
        targetValue: -14,
        condition: 'always',
        batchMode: 'each',
      },
      trimFade: {
        trimStart: false,
        trimEnd: false,
        trimThresholdDb: -60,
        padStartMs: 0,
        padEndMs: 0,
        fadeInMs: 0,
        fadeOutMs: 0,
        fadeCurve: 'linear',
      },
      limiter: {
        enabled: true,
        type: 'true-peak',
        ceiling: 0,
        batchMode: 'each',
      },
      output: {
        bitDepth: 16,
        filenameSuffix: '_mastered',
        monoMode: 'off',
      },
    },
  },
];
