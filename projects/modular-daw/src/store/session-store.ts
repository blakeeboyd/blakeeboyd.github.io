import { create } from 'zustand';

export interface SessionState {
  currentSessionId: string | null;
  currentSessionName: string;
  setCurrentSession(id: string | null, name: string): void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  currentSessionId: null,
  currentSessionName: '',
  setCurrentSession(id, name) {
    set({ currentSessionId: id, currentSessionName: name });
  },
}));
