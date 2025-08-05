import { create } from "zustand";

type Wallet = { id: string; name: string; balance: number };
type WalletState = {
  wallets: Wallet[];
  setWallets: (wallets: Wallet[]) => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  wallets: [],
  setWallets: (wallets) => set({ wallets }),
}));
