import { create } from 'zustand';
import { createId } from '@/lib/id';
import type {
  AudioFileEntry,
  FileStatus,
  NormalizeSettings,
  LimiterSettings,
  OutputSettings,
  ProcessingJobSettings,
} from '@/types/normalizer';

const defaultNormalize: NormalizeSettings = {
  enabled: true,
  type: 'lufs-i',
  targetValue: -14,
  condition: 'always',
};

const defaultLimiter: LimiterSettings = {
  enabled: true,
  type: 'peak',
  ceiling: -1,
};

const defaultOutput: OutputSettings = {
  bitDepth: 24,
  filenameSuffix: '_normalized',
};

interface NormalizerState {
  files: AudioFileEntry[];
  normalize: NormalizeSettings;
  limiter: LimiterSettings;
  output: OutputSettings;
  isProcessing: boolean;

  addFiles: (fileList: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateFile: (id: string, patch: Partial<AudioFileEntry>) => void;

  setNormalize: (patch: Partial<NormalizeSettings>) => void;
  setLimiter: (patch: Partial<LimiterSettings>) => void;
  setOutput: (patch: Partial<OutputSettings>) => void;

  setIsProcessing: (val: boolean) => void;
  getSettings: () => ProcessingJobSettings;
}

export const useNormalizerStore = create<NormalizerState>()((set, get) => ({
  files: [],
  normalize: { ...defaultNormalize },
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
  setLimiter: (patch) => set({ limiter: { ...get().limiter, ...patch } }),
  setOutput: (patch) => set({ output: { ...get().output, ...patch } }),

  setIsProcessing: (val) => set({ isProcessing: val }),

  getSettings: (): ProcessingJobSettings => ({
    normalize: get().normalize,
    limiter: get().limiter,
    output: get().output,
  }),
}));
