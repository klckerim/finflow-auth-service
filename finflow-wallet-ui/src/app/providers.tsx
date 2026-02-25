"use client";

import { FinflowSessionProvider } from "@/context/finflow-session";

export function Providers({ children }: { children: React.ReactNode }) {
  return <FinflowSessionProvider>{children}</FinflowSessionProvider>;
}
