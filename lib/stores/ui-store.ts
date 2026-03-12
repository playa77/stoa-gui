import { create } from 'zustand';

type UiState = {
  activeSessionId?: string;
  inspectorOpen: boolean;
  setActiveSessionId: (sessionId?: string) => void;
  toggleInspector: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  activeSessionId: undefined,
  inspectorOpen: true,
  setActiveSessionId: (activeSessionId) => set({ activeSessionId }),
  toggleInspector: () => set((state) => ({ inspectorOpen: !state.inspectorOpen })),
}));
