import { create } from "zustand";

interface CursorState {
  icon: React.ReactNode | undefined;
  setIcon: (icon?: React.ReactNode) => void;
}

export const useCursorStore = create<CursorState>()((set) => ({
  icon: undefined,
  setIcon: (icon) => set(() => ({ icon })),
}));
