import { create } from 'zustand';

interface Stores {
  connectServer: string;
}

interface StoresActions {
  setConnectServer: (serverName: string) => void;
}

type BearStore = Stores & StoresActions;

export const useStore = create<BearStore>(set => ({
  connectServer: '',
  setConnectServer: (serverName: string) => set(state => ({ connectServer: serverName })),
}));
