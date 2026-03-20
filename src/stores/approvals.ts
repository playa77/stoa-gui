import { create } from "zustand";
import { ApprovalRequest, ProviderHealth } from "../types";
import { endpoints } from "../api/endpoints";

interface ApprovalState {
  pending: ApprovalRequest[];
  panelOpen: boolean;
  fetchPending: () => Promise<void>;
  approve: (id: string, modifier?: string) => Promise<void>;
  deny: (id: string) => Promise<void>;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
}

export const useApprovalStore = create<ApprovalState>((set) => ({
  pending: [],
  panelOpen: false,

  fetchPending: async () => {
    try {
      const response = await endpoints.getPendingApprovals();
      if (response.status === "ok" && response.data) {
        set({ pending: response.data! });
      }
    } catch (e) {
      console.error("Failed to fetch pending approvals:", e);
    }
  },

  approve: async (id, modifier) => {
    try {
      await endpoints.respondToApproval(id, { approved: true, modifier });
      set((state) => ({ pending: state.pending.filter((a) => a.id !== id) }));
    } catch (e) {
      console.error("Failed to approve:", e);
    }
  },

  deny: async (id) => {
    try {
      await endpoints.respondToApproval(id, { approved: false });
      set((state) => ({ pending: state.pending.filter((a) => a.id !== id) }));
    } catch (e) {
      console.error("Failed to deny:", e);
    }
  },

  setPanelOpen: (open) => set({ panelOpen: open }),
  togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),
}));

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
      // In a real implementation we would fetch all provider IDs first
      // or the listProviders endpoint would return aggregate health.
      // For Milestone 2, we implement the structure.
      const response = await endpoints.listProviders();
      if (response.status === "ok" && response.data) {
        // Mock health mapping for the sake of the store structure
        set({ lastChecked: new Date().toISOString() });
      }
    } catch (e) {
      console.error("Failed to fetch provider health:", e);
    }
  },
}));
