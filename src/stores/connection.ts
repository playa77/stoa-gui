import { create } from "zustand";

export type ConnectionStatus = "connected" | "disconnected" | "reconnecting" | "auth_failed";

interface ConnectionState {
  status: ConnectionStatus;
  backendUrl: string;
  lastPingAt: string | null;
  setStatus: (status: ConnectionStatus) => void;
  setLastPingAt: (at: string) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: "disconnected",
  backendUrl: "http://localhost:8420",
  lastPingAt: null,
  setStatus: (status) => set({ status }),
  setLastPingAt: (at) => set({ lastPingAt: at }),
  connect: () => {
    // Logic for initial connection check would be here
    set({ status: "connected" });
  },
  disconnect: () => set({ status: "disconnected" }),
}));
