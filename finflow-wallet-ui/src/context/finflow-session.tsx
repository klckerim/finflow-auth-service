"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultApiBase, FinflowSession } from "@/lib/finflow-api";

type SessionContextValue = {
  apiBase: string;
  setApiBase: (value: string) => void;
  session: FinflowSession | null;
  setSession: (value: FinflowSession | null) => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const SESSION_KEY = "finflow-wallet-session";
const API_BASE_KEY = "finflow-wallet-api-base";

export function FinflowSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<FinflowSession | null>(null);
  const [apiBase, setApiBaseState] = useState(defaultApiBase());

  useEffect(() => {
    const rawSession = window.localStorage.getItem(SESSION_KEY);
    const rawApiBase = window.localStorage.getItem(API_BASE_KEY);

    if (rawSession) {
      setSessionState(JSON.parse(rawSession));
    }

    if (rawApiBase) {
      setApiBaseState(rawApiBase);
    }
  }, []);

  const setSession = (value: FinflowSession | null) => {
    setSessionState(value);
    if (!value) {
      window.localStorage.removeItem(SESSION_KEY);
      return;
    }

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(value));
  };

  const setApiBase = (value: string) => {
    setApiBaseState(value);
    window.localStorage.setItem(API_BASE_KEY, value);
  };

  const memoizedValue = useMemo(
    () => ({ apiBase, setApiBase, session, setSession }),
    [apiBase, session]
  );

  return <SessionContext.Provider value={memoizedValue}>{children}</SessionContext.Provider>;
}

export function useFinflowSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useFinflowSession must be used within FinflowSessionProvider");
  }

  return context;
}
