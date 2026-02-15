import { create } from 'zustand';
import { createId } from '@/lib/id';
import type {
  AudioFileEntry,
  FileStatus,
  NormalizeSettings,
  TrimFadeSettings,
  LimiterSettings,
  OutputSettings,
  ProcessingJobSettings,
  PresetSettings,
} from '@/types/normalizer';

export const defaultNormalize: NormalizeSettings = {
  enabled: true,
  type: 'lufs-i',
  targetValue: -14,
  condition: 'always',
  batchMode: 'each',
};

export const defaultTrimFade: TrimFadeSettings = {
  trimStart: false,
  trimEnd: false,
  trimThresholdDb: -60,
  padStartMs: 0,
  padEndMs: 0,
  fadeInMs: 0,
  fadeOutMs: 0,
  fadeCurve: 'linear',
};

export const defaultLimiter: LimiterSettings = {
  enabled: true,
  type: 'peak',
  ceiling: -1,
  batchMode: 'each',
};

export const defaultOutput: OutputSettings = {
  bitDepth: 24,
  filenameSuffix: '_normalized',
  monoMode: 'off',
};

interface NormalizerState {
  files: AudioFileEntry[];
  normalize: NormalizeSettings;
  trimFade: TrimFadeSettings;
  limiter: LimiterSettings;
  output: OutputSettings;
  isProcessing: boolean;

  addFiles: (fileList: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateFile: (id: string, patch: Partial<AudioFileEntry>) => void;

  setNormalize: (patch: Partial<NormalizeSettings>) => void;
  setTrimFade: (patch: Partial<TrimFadeSettings>) => void;
  setLimiter: (patch: Partial<LimiterSettings>) => void;
  setOutput: (patch: Partial<OutputSettings>) => void;

  setIsProcessing: (val: boolean) => void;
  getSettings: () => ProcessingJobSettings;
  applySettings: (settings: PresetSettings) => void;
}

export const useNormalizerStore = create<NormalizerState>()((set, get) => ({
  files: [],
  normalize: { ...defaultNormalize },
  trimFade: { ...defaultTrimFade },
  limiter: { ...defaultLimiter },
  output: { ...defaultOutput },
  isProcessing: false,

  addFiles: (fileList) => {
    const entries: AudioFileEntry[] = fileList.map(file => ({
      id: createId(),
      file,
      name: file.name,
      status: 'pending' as FileStatus,
      progress: 0,
    }));
    set({ files: [...get().files, ...entries] });
  },

  removeFile: (id) => {
    set({ files: get().files.filter(f => f.id !== id) });
  },

  clearFiles: () => {
    set({ files: [] });
  },

  updateFile: (id, patch) => {
    set({ files: get().files.map(f => f.id === id ? { ...f, ...patch } : f) });
  },

  setNormalize: (patch) => set({ normalize: { ...get().normalize, ...patch } }),
  setTrimFade: (patch) => set({ trimFade: { ...get().trimFade, ...patch } }),
  setLimiter: (patch) => set({ limiter: { ...get().limiter, ...patch } }),
  setOutput: (patch) => set({ output: { ...get().output, ...patch } }),

  setIsProcessing: (val) => set({ isProcessing: val }),

  getSettings: (): ProcessingJobSettings => ({
    normalize: get().normalize,
    trimFade: get().trimFade,
    limiter: get().limiter,
    output: get().output,
  }),

  applySettings: (settings: PresetSettings) => set({
    normalize: { ...settings.normalize },
    trimFade: { ...settings.trimFade },
    limiter: { ...settings.limiter },
    output: { ...settings.output },
  }),
}));
