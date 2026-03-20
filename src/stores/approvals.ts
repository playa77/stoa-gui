import { create } from "zustand";
import { ApprovalRequest } from "../types";
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
