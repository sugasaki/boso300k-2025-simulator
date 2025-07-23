import { create } from 'zustand';

type AppState = {
  isDrawerMenuOpen: boolean;
  isLeftDrawerMenuOpen: boolean;
};

export const useAppStore = create<
  AppState & {
    setIsDrawerMenuOpen: (value: boolean) => void;
    setIsLeftDrawerMenuOpen: (value: boolean) => void;
  }
>(set => ({
  isDrawerMenuOpen: false,
  isLeftDrawerMenuOpen: false,
  setIsDrawerMenuOpen: value => set({ isDrawerMenuOpen: value }),
  setIsLeftDrawerMenuOpen: value => set({ isLeftDrawerMenuOpen: value }),
}));
