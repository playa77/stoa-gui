import { create } from "zustand";
import { Session, SessionMode } from "../types";
import { endpoints } from "../api/endpoints";

interface SessionState {
  sessions: Record<string, Session>;
  activeSessionId: string | null;
  activeMode: SessionMode;
  loading: boolean;
  fetchSessions: (mode?: SessionMode) => Promise<void>;
  createSession: (mode: SessionMode, opts?: any) => Promise<Session | null>;
  setActive: (id: string) => void;
  updateSession: (session: Session) => void;
  setMode: (mode: SessionMode) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: {},
  activeSessionId: null,
  activeMode: SessionMode.CHAT,
  loading: false,

  fetchSessions: async (mode) => {
    set({ loading: true });
    try {
      const response = await endpoints.listSessions({ mode });
      if (response.status === "ok" && response.data) {
        const sessionMap = response.data.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
        set({ sessions: sessionMap });
      }
    } finally {
      set({ loading: false });
    }
  },

  createSession: async (mode, opts) => {
    set({ loading: true });
    try {
      const response = await endpoints.createSession({ mode, ...opts });
      if (response.status === "ok" && response.data) {
        set((state) => ({
          sessions: { ...state.sessions, [response.data!.id]: response.data! },
          activeSessionId: response.data!.id,
        }));
        return response.data;
      }
    } finally {
      set({ loading: false });
    }
    return null;
  },

  setActive: (id) => set({ activeSessionId: id }),

  updateSession: (session) =>
    set((state) => ({
      sessions: { ...state.sessions, [session.id]: session },
    })),

  setMode: (mode) => set({ activeMode: mode }),
}));
