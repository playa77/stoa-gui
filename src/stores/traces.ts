import { create } from "zustand";
import { TraceEvent, RunSummary, Skill, SkillPack } from "../types";
import { endpoints } from "../api/endpoints";

interface TraceState {
  events: Record<string, TraceEvent[]>;
  panelOpen: boolean;
  filter: string[];
  // Replay specific state
  activeTraceId: string | null;
  selectedEventId: string | null;
  playbackIndex: number; // For scrubbing through events
  isReplayMode: boolean;
  
  fetchTrace: (traceId: string) => Promise<void>;
  fetchSummary: (traceId: string) => Promise<RunSummary | null>;
  setFilter: (types: string[]) => void;
  togglePanel: () => void;
  
  // Replay actions
  setActiveTrace: (traceId: string | null) => void;
  selectEvent: (eventId: string | null) => void;
  setPlaybackIndex: (index: number) => void;
  setReplayMode: (active: boolean) => void;
}

export const useTraceStore = create<TraceState>((set) => ({
  events: {},
  panelOpen: false,
  filter: [],
  activeTraceId: null,
  selectedEventId: null,
  playbackIndex: -1,
  isReplayMode: false,

  fetchTrace: async (traceId) => {
    try {
      const response = await endpoints.getTraceEvents(traceId);
      if (response.status === "ok" && response.data) {
        set((state) => ({
          events: { ...state.events, [traceId]: response.data! },
        }));
      }
    } catch (e) {
      console.error("Failed to fetch trace:", e);
    }
  },

  fetchSummary: async (traceId) => {
    try {
      const response = await endpoints.getTraceSummary(traceId);
      if (response.status === "ok") {
        return response.data;
      }
    } catch (e) {
      console.error("Failed to fetch summary:", e);
    }
    return null;
  },

  setFilter: (types) => set({ filter: types }),
  togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),

  setActiveTrace: (traceId) => set({ activeTraceId: traceId, playbackIndex: -1, selectedEventId: null }),
  selectEvent: (eventId) => set({ selectedEventId: eventId }),
  setPlaybackIndex: (index) => set({ playbackIndex: index }),
  setReplayMode: (active) => set({ isReplayMode: active }),
}));

interface SkillState {
  skills: Skill[];
  packs: SkillPack[];
  fetchSkills: () => Promise<void>;
  fetchPacks: () => Promise<void>;
}

export const useSkillStore = create<SkillState>((set) => ({
  skills: [],
  packs: [],

  fetchSkills: async () => {
    const response = await endpoints.listSkills();
    if (response.status === "ok" && response.data) {
      set({ skills: response.data! });
    }
  },

  fetchPacks: async () => {
    const response = await endpoints.listSkillPacks();
    if (response.status === "ok" && response.data) {
      set({ packs: response.data! });
    }
  },
}));
