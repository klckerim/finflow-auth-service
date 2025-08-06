"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Tip tanımı
type Wallet = {
    id: string;
    name: string;
    balance: number;
};

type User = {
    id: string;
    name: string;
    email: string;
};

type GlobalContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    wallets: Wallet[];
    setWallets: (wallets: Wallet[]) => void;
    selectedWallet: Wallet | null;
    setSelectedWallet: (wallet: Wallet | null) => void;
    totalBalance: number;
    setTotalBalance: (balance: number) => void;
    baseCurrency: string;
    setBaseCurrency: (currency: string) => void;
};


const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Provider bileşeni
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [baseCurrency, setBaseCurrency] = useState<string>("EUR");


    return (
        <GlobalContext.Provider
            value={{
                user,
                setUser,
                wallets,
                setWallets,
                selectedWallet,
                setSelectedWallet,
                totalBalance,
                setTotalBalance,
                baseCurrency,
                setBaseCurrency
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};


export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within GlobalProvider");
    }
    return context;
};
