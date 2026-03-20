import { create } from "zustand";
import { SessionMode } from "../types";

interface UIState {
  activeMode: SessionMode;
  sidebarOpen: boolean;
  tracePanelOpen: boolean;
  approvalPanelOpen: boolean;
  setMode: (mode: SessionMode) => void;
  toggleSidebar: () => void;
  toggleTracePanel: () => void;
  toggleApprovalPanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeMode: SessionMode.CHAT,
  sidebarOpen: true,
  tracePanelOpen: false,
  approvalPanelOpen: false,
  setMode: (mode) => set({ activeMode: mode }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleTracePanel: () => set((state) => ({ tracePanelOpen: !state.tracePanelOpen })),
  toggleApprovalPanel: () => set((state) => ({ approvalPanelOpen: !state.approvalPanelOpen })),
}));
