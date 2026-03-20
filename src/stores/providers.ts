import { create } from "zustand";
import { ProviderHealth } from "../types";
import { endpoints } from "../api/endpoints";

interface ProviderState {
  providers: ProviderHealth[];
  lastChecked: string | null;
  fetchHealth: () => Promise<void>;
}

export const useProviderStore = create<ProviderState>((set) => ({
  providers: [],
  lastChecked: null,

  fetchHealth: async () => {
    try {
      const response = await endpoints.listProviders();
      if (response.status === "ok" && response.data) {
        set({ lastChecked: new Date().toISOString() });
      }
    } catch (e) {
      console.error("Failed to fetch provider health:", e);
    }
  },
}));
