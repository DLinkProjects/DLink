import { create } from 'zustand';
import { entity } from '@wailsApp/go/models';

interface Stores {
  summary: entity.Summary;
  images: entity.Image[];
  selecteServer: string;
}

interface StoresActions {
  setSummary: (data: entity.Summary) => void;
  setImages: (data: entity.Image[]) => void;
  setSelectServer: (data: string) => void;
}

type BearStore = Stores & StoresActions;

export const useStore = create<BearStore>(set => ({
  summary: new entity.Summary(),
  setSummary: (data: entity.Summary) => set({ summary: data }),
  images: [],
  setImages: (data: entity.Image[]) => set({ images: data }),
  selecteServer: '',
  setSelectServer: (data: string) => set({ selecteServer: data }),
}));
