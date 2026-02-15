import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId } from '@/lib/id';
import { useNormalizerStore } from './normalizer-store';
import { BUILT_IN_PRESETS } from '@/lib/normalizer/built-in-presets';
import type { Preset } from '@/types/normalizer';

interface PresetStoreState {
  presets: Preset[];
  activePresetId: string | null;

  loadPreset: (id: string) => void;
  savePreset: (name: string) => string;
  updatePreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;
  deletePreset: (id: string) => void;
}

export const usePresetStore = create<PresetStoreState>()(
  persist(
    (set, get) => ({
      presets: [...BUILT_IN_PRESETS],
      activePresetId: null,

      loadPreset: (id) => {
        const preset = get().presets.find(p => p.id === id);
        if (!preset) return;
        useNormalizerStore.getState().applySettings(preset.settings);
        set({ activePresetId: id });
      },

      savePreset: (name) => {
        const id = createId();
        const { normalize, trimFade, limiter, output } = useNormalizerStore.getState();
        const preset: Preset = {
          id,
          name,
          builtIn: false,
          settings: {
            normalize: { ...normalize },
            trimFade: { ...trimFade },
            limiter: { ...limiter },
            output: { ...output },
          },
        };
        set({ presets: [...get().presets, preset], activePresetId: id });
        return id;
      },

      updatePreset: (id) => {
        const existing = get().presets.find(p => p.id === id);
        if (!existing || existing.builtIn) return;
        const { normalize, trimFade, limiter, output } = useNormalizerStore.getState();
        set({
          presets: get().presets.map(p =>
            p.id === id
              ? {
                  ...p,
                  settings: {
                    normalize: { ...normalize },
                    trimFade: { ...trimFade },
                    limiter: { ...limiter },
                    output: { ...output },
                  },
                }
              : p
          ),
        });
      },

      renamePreset: (id, name) => {
        set({
          presets: get().presets.map(p =>
            p.id === id && !p.builtIn ? { ...p, name } : p
          ),
        });
      },

      deletePreset: (id) => {
        const preset = get().presets.find(p => p.id === id);
        if (!preset || preset.builtIn) return;
        const activeId = get().activePresetId === id ? null : get().activePresetId;
        set({
          presets: get().presets.filter(p => p.id !== id),
          activePresetId: activeId,
        });
      },
    }),
    {
      name: 'sb-norm-presets',
      merge: (persisted, current) => {
        const stored = persisted as Partial<PresetStoreState> | undefined;
        if (!stored?.presets) return current;

        // Keep user presets from storage, always use fresh built-in definitions
        const userPresets = stored.presets.filter(p => !p.builtIn);
        return {
          ...current,
          presets: [...BUILT_IN_PRESETS, ...userPresets],
          activePresetId: stored.activePresetId ?? null,
        };
      },
    },
  ),
);
