import { create } from 'zustand';
import { entity } from '@wailsApp/go/models';

interface Stores {
  connected: boolean;
  summary: entity.Summary | null;
  images: entity.Image[];
  selecteServer: string;
}

interface StoresActions {
  setConnected: () => void;
  setSummary: (data: entity.Summary) => void;
  setImages: (data: entity.Image[]) => void;
  setSelectServer: (data: string) => void;
}

type BearStore = Stores & StoresActions;

export const useStore = create<BearStore>(set => ({
  connected: false,
  setConnected: () => set(() => ({ connected: true })),
  summary: null,
  setSummary: (data: entity.Summary) => set({ summary: data }),
  images: [],
  setImages: (data: entity.Image[]) => set({ images: data }),
  selecteServer: '',
  setSelectServer: (data: string) => set({ selecteServer: data }),
}));
