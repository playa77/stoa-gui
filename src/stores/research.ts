import { create } from "zustand";
import { Source, RetrievalResult, SynthesisResult, SourceInput } from "../types";
import { endpoints } from "../api/endpoints";

interface ResearchState {
  sources: Source[];
  retrievalResults: RetrievalResult[];
  synthesis: SynthesisResult | null;
  loading: boolean;
  ingest: (sources: SourceInput[]) => Promise<void>;
  retrieve: (query: string, sessionId: string) => Promise<void>;
  synthesize: (query: string) => Promise<void>;
}

export const useResearchStore = create<ResearchState>((set) => ({
  sources: [],
  retrievalResults: [],
  synthesis: null,
  loading: false,

  ingest: async (sources) => {
    set({ loading: true });
    try {
      const response = await endpoints.ingestSources({ sources });
      if (response.status === "ok" && response.data) {
        set((state) => ({ sources: [...state.sources, ...response.data!] }));
      }
    } finally {
      set({ loading: false });
    }
  },

  retrieve: async (query, sessionId) => {
    set({ loading: true });
    try {
      const response = await endpoints.retrieve({ query, sessionId });
      if (response.status === "ok" && response.data) {
        set({ retrievalResults: response.data! });
      }
    } finally {
      set({ loading: false });
    }
  },

  synthesize: async (query) => {
    set({ loading: true });
    try {
      const results = useResearchStore.getState().retrievalResults;
      const response = await endpoints.synthesize({ query, retrievalResults: results });
      if (response.status === "ok" && response.data) {
        set({ synthesis: response.data! });
      }
    } finally {
      set({ loading: false });
    }
  },
}));
