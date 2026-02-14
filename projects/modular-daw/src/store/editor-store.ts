import { create } from 'zustand';
import { temporal } from 'zundo';
import { nanoid } from 'nanoid';
import type { Region, EditorTool, GridResolution, OverlapMode } from '../types/region';

export const GRID_PRESETS: GridResolution[] = [
  { label: 'Free', value: null },
  { label: '1 bar', value: 0 },       // computed from bpm
  { label: '1/2 note', value: 0 },
  { label: '1/4 note', value: 0 },
  { label: '1/8 note', value: 0 },
  { label: '1/16 note', value: 0 },
  { label: '1 sec', value: 1 },
  { label: '0.5 sec', value: 0.5 },
  { label: '0.1 sec', value: 0.1 },
];

/** Compute actual grid value in seconds for beat-based presets */
export function resolveGridValue(preset: GridResolution, bpm: number): number | null {
  if (preset.value !== null && preset.value > 0) return preset.value;
  if (preset.value === null) return null;

  const beatSec = 60 / bpm;
  switch (preset.label) {
    case '1 bar':     return beatSec * 4;
    case '1/2 note':  return beatSec * 2;
    case '1/4 note':  return beatSec;
    case '1/8 note':  return beatSec / 2;
    case '1/16 note': return beatSec / 4;
    default:          return null;
  }
}

export interface EditorState {
  isOpen: boolean;
  selectedTrackIds: string[];

  zoom: number;        // pixels per second
  scrollX: number;     // horizontal scroll offset in seconds

  activeTool: EditorTool;

  gridResolution: GridResolution;
  snapEnabled: boolean;

  overlapMode: OverlapMode;

  /** Regions keyed by track ID */
  regions: Record<string, Region[]>;
  selectedRegionIds: string[];

  openEditor(trackId: string): void;
  toggleTrackInEditor(trackId: string): void;
  closeEditor(): void;
  setZoom(zoom: number): void;
  setScrollX(x: number): void;
  setTool(tool: EditorTool): void;
  setGridResolution(res: GridResolution): void;
  toggleSnap(): void;
  addRegion(region: Omit<Region, 'id'>): string;
  updateRegion(id: string, patch: Partial<Region>): void;
  removeRegion(id: string): void;
  removeRegionsForTrack(trackId: string): void;
  splitRegion(id: string, atTime: number): void;
  setOverlapMode(mode: OverlapMode): void;
  selectRegions(ids: string[]): void;
  getRegionsForTrack(trackId: string): Region[];
}

export const useEditorStore = create<EditorState>()(
  temporal(
    (set, get) => ({
      isOpen: false,
      selectedTrackIds: [],
      zoom: 100,       // 100px per second default
      scrollX: 0,
      activeTool: 'pointer',
      gridResolution: GRID_PRESETS[0], // Free
      snapEnabled: true,
      overlapMode: 'layer' as OverlapMode,
      regions: {},
      selectedRegionIds: [],

      openEditor(trackId) {
        set({ isOpen: true, selectedTrackIds: [trackId], selectedRegionIds: [] });
      },

      toggleTrackInEditor(trackId) {
        const { selectedTrackIds } = get();
        if (selectedTrackIds.includes(trackId)) {
          const remaining = selectedTrackIds.filter(id => id !== trackId);
          if (remaining.length === 0) {
            set({ isOpen: false, selectedTrackIds: [], selectedRegionIds: [] });
          } else {
            set({ selectedTrackIds: remaining });
          }
        } else {
          set({ isOpen: true, selectedTrackIds: [...selectedTrackIds, trackId] });
        }
      },

      closeEditor() {
        set({ isOpen: false, selectedTrackIds: [], selectedRegionIds: [] });
      },

      setZoom(zoom) {
        set({ zoom: Math.max(10, Math.min(1000, zoom)) });
      },

      setScrollX(x) {
        set({ scrollX: Math.max(0, x) });
      },

      setTool(tool) {
        set({ activeTool: tool });
      },

      setGridResolution(res) {
        set({ gridResolution: res });
      },

      toggleSnap() {
        set((s) => ({ snapEnabled: !s.snapEnabled }));
      },

      addRegion(regionData) {
        const id = nanoid();
        const region: Region = { ...regionData, id };
        const { regions } = get();
        const trackRegions = regions[region.trackId] ?? [];
        set({
          regions: {
            ...regions,
            [region.trackId]: [...trackRegions, region],
          },
        });
        return id;
      },

      updateRegion(id, patch) {
        const { regions } = get();
        const updated: Record<string, Region[]> = {};
        for (const [trackId, trackRegions] of Object.entries(regions)) {
          updated[trackId] = trackRegions.map((r) =>
            r.id === id ? { ...r, ...patch } : r
          );
        }
        set({ regions: updated });
      },

      removeRegion(id) {
        const { regions } = get();
        const updated: Record<string, Region[]> = {};
        for (const [trackId, trackRegions] of Object.entries(regions)) {
          updated[trackId] = trackRegions.filter((r) => r.id !== id);
        }
        set({
          regions: updated,
          selectedRegionIds: get().selectedRegionIds.filter((rid) => rid !== id),
        });
      },

      removeRegionsForTrack(trackId) {
        const { regions } = get();
        const updated = { ...regions };
        delete updated[trackId];
        set({
          regions: updated,
          selectedRegionIds: get().selectedRegionIds.filter((rid) => {
            const allRegions = Object.values(regions).flat();
            const region = allRegions.find((r) => r.id === rid);
            return region ? region.trackId !== trackId : true;
          }),
        });
      },

      splitRegion(id, atTime) {
        const { regions } = get();
        for (const [trackId, trackRegions] of Object.entries(regions)) {
          const idx = trackRegions.findIndex((r) => r.id === id);
          if (idx === -1) continue;

          const region = trackRegions[idx];
          const splitPoint = atTime - region.position;

          // Must split within region bounds
          if (splitPoint <= 0 || splitPoint >= region.duration) return;

          const left: Region = {
            id: nanoid(),
            trackId: region.trackId,
            bufferRef: region.bufferRef,
            position: region.position,
            sourceOffset: region.sourceOffset,
            duration: splitPoint,
            fadeIn: region.fadeIn,
            fadeOut: 0.005,
          };

          const right: Region = {
            id: nanoid(),
            trackId: region.trackId,
            bufferRef: region.bufferRef,
            position: atTime,
            sourceOffset: region.sourceOffset + splitPoint,
            duration: region.duration - splitPoint,
            fadeIn: 0.005,
            fadeOut: region.fadeOut,
          };

          const newTrackRegions = [...trackRegions];
          newTrackRegions.splice(idx, 1, left, right);

          set({
            regions: { ...regions, [trackId]: newTrackRegions },
            selectedRegionIds: [left.id, right.id],
          });
          return;
        }
      },

      setOverlapMode(mode) {
        set({ overlapMode: mode });
      },

      selectRegions(ids) {
        set({ selectedRegionIds: ids });
      },

      getRegionsForTrack(trackId) {
        return get().regions[trackId] ?? [];
      },
    }),
    {
      limit: 100,
      partialize: (state) => ({
        regions: state.regions,
      }),
    }
  )
);
