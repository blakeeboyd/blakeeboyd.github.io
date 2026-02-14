import { create } from 'zustand';

export interface TransportState {
  isPlaying: boolean;
  position: number;       // playback position in seconds
  bpm: number;
  loopEnabled: boolean;
  loopStart: number;
  loopEnd: number;

  play(): void;
  stop(): void;
  pause(): void;
  seek(position: number): void;
  setBpm(bpm: number): void;
  setLoop(start: number, end: number): void;
  toggleLoop(): void;
  /** Called by rAF loop to update position display */
  setPosition(position: number): void;
}

export const useTransportStore = create<TransportState>()((set) => ({
  isPlaying: false,
  position: 0,
  bpm: 120,
  loopEnabled: false,
  loopStart: 0,
  loopEnd: 0,

  play() {
    set({ isPlaying: true });
  },

  stop() {
    set({ isPlaying: false, position: 0 });
  },

  pause() {
    set({ isPlaying: false });
  },

  seek(position) {
    set({ position });
  },

  setBpm(bpm) {
    set({ bpm });
  },

  setLoop(start, end) {
    set({ loopStart: start, loopEnd: end, loopEnabled: true });
  },

  toggleLoop() {
    set((s) => ({ loopEnabled: !s.loopEnabled }));
  },

  setPosition(position) {
    set({ position });
  },
}));
