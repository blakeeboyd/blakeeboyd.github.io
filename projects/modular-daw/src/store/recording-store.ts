import { create } from 'zustand';

export interface RecordingState {
  armedTrackIds: string[];
  isRecording: boolean;
  inputMonitoring: boolean;
  latencyCompensation: number;   // measured from AudioContext (seconds)
  manualLatencyOffset: number;   // user-adjustable offset (seconds)

  armTrack(id: string): void;
  disarmTrack(id: string): void;
  toggleArm(id: string): void;
  setRecording(recording: boolean): void;
  setInputMonitoring(enabled: boolean): void;
  setLatencyCompensation(seconds: number): void;
  setManualLatencyOffset(seconds: number): void;
}

export const useRecordingStore = create<RecordingState>()((set, get) => ({
  armedTrackIds: [],
  isRecording: false,
  inputMonitoring: false,
  latencyCompensation: 0,
  manualLatencyOffset: 0,

  armTrack(id) {
    const { armedTrackIds } = get();
    if (!armedTrackIds.includes(id)) {
      set({ armedTrackIds: [...armedTrackIds, id] });
    }
  },

  disarmTrack(id) {
    set({ armedTrackIds: get().armedTrackIds.filter(t => t !== id) });
  },

  toggleArm(id) {
    const { armedTrackIds } = get();
    if (armedTrackIds.includes(id)) {
      set({ armedTrackIds: armedTrackIds.filter(t => t !== id) });
    } else {
      set({ armedTrackIds: [...armedTrackIds, id] });
    }
  },

  setRecording(recording) {
    set({ isRecording: recording });
  },

  setInputMonitoring(enabled) {
    set({ inputMonitoring: enabled });
  },

  setLatencyCompensation(seconds) {
    set({ latencyCompensation: seconds });
  },

  setManualLatencyOffset(seconds) {
    set({ manualLatencyOffset: seconds });
  },
}));
