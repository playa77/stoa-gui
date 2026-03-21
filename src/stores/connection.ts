import { create } from "zustand";

export type ConnectionStatus = "connected" | "disconnected" | "reconnecting" | "auth_failed";

export interface ProviderHealth {
  providerId: string;
  available: boolean;
  latencyMs: number;
  error: string | null;
}

interface ConnectionState {
  status: ConnectionStatus;
  backendUrl: string;
  lastPingAt: string | null;
  providers: ProviderHealth[]; // Added for M12
  latencyMs: number; // Global backend latency
  
  setStatus: (status: ConnectionStatus) => void;
  setLastPingAt: (at: string) => void;
  setProviders: (providers: ProviderHealth[]) => void;
  setLatency: (ms: number) => void;
  
  connect: () => void;
  disconnect: () => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: "disconnected",
  backendUrl: "http://localhost:8420",
  lastPingAt: null,
  providers: [],
  latencyMs: 0,

  setStatus: (status) => set({ status }),
  setLastPingAt: (at) => set({ lastPingAt: at }),
  setProviders: (providers) => set({ providers }),
  setLatency: (ms) => set({ latencyMs: ms }),

  connect: () => {
    set({ status: "connected" });
  },
  disconnect: () => set({ status: "disconnected" }),
}));
