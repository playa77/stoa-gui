import { create } from "zustand";
import { DeliberationResult, FileInfo, FileContent, PatchProposal, ExecutionResult, EvalRun, ComparisonResult } from "../types";
import { endpoints } from "../api/endpoints";

interface DeliberationState {
  result: DeliberationResult | null;
  loading: boolean;
  run: (question: string, frames: string[], opts?: any) => Promise<void>;
  fetch: (id: string) => Promise<void>;
}

export const useDeliberationStore = create<DeliberationState>((set) => ({
  result: null,
  loading: false,

  run: async (question, frames, opts) => {
    set({ loading: true });
    try {
      const response = await endpoints.runDeliberation({ question, frames, ...opts });
      if (response.status === "ok" && response.data) {
        set({ result: response.data! });
      }
    } finally {
      set({ loading: false });
    }
  },

  fetch: async (id) => {
    set({ loading: true });
    try {
      const response = await endpoints.getDeliberation(id);
      if (response.status === "ok" && response.data) {
        set({ result: response.data! });
      }
    } finally {
      set({ loading: false });
    }
  },
}));

interface WorkspaceState {
  files: FileInfo[];
  currentPath: string;
  openFile: FileContent | null;
  pendingPatch: PatchProposal | null;
  navigate: (path: string) => Promise<void>;
  readFile: (path: string) => Promise<void>;
  proposeWrite: (path: string, content: string) => Promise<void>;
  executeCommand: (cmd: string) => Promise<ExecutionResult | null>;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  files: [],
  currentPath: "~",
  openFile: null,
  pendingPatch: null,

  navigate: async (path) => {
    const response = await endpoints.listFiles({ path });
    if (response.status === "ok" && response.data) {
      set({ files: response.data!, currentPath: path });
    }
  },

  readFile: async (path) => {
    const response = await endpoints.readFile({ path });
    if (response.status === "ok" && response.data) {
      set({ openFile: response.data! });
    }
  },

  proposeWrite: async (path, content) => {
    await endpoints.writeFile({ path, content });
    // This typically routes through approval store
  },

  executeCommand: async (command) => {
    const response = await endpoints.executeCommand({ command });
    if (response.status === "ok" && response.data) {
      return response.data;
    }
    return null;
  },
}));

interface ArenaState {
  runs: EvalRun[];
  comparison: ComparisonResult | null;
  loading: boolean;
  startRun: (taskId: string, provider: string, model: string, pack?: string) => Promise<void>;
  fetchRuns: (taskId?: string) => Promise<void>;
  compare: (runIds: string[]) => Promise<void>;
}

export const useArenaStore = create<ArenaState>((set) => ({
  runs: [],
  comparison: null,
  loading: false,

  startRun: async (taskId, provider, model, pack) => {
    set({ loading: true });
    try {
      const response = await endpoints.runEval({ taskId, provider, model, skillPack: pack });
      if (response.status === "ok" && response.data) {
        set((state) => ({ runs: [response.data!, ...state.runs] }));
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchRuns: async (taskId) => {
    set({ loading: true });
    try {
      const response = await endpoints.listEvalRuns({ taskId });
      if (response.status === "ok" && response.data) {
        set({ runs: response.data! });
      }
    } finally {
      set({ loading: false });
    }
  },

  compare: async (runIds) => {
    set({ loading: true });
    try {
      const response = await endpoints.compareEvalRuns({ runIds });
      if (response.status === "ok" && response.data) {
        set({ comparison: response.data! });
      }
    } finally {
      set({ loading: false });
    }
  },
}));
