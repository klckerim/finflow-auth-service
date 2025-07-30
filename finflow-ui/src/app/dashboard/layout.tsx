"use client";

import { Sidebar } from "../../components/sidebar";
import { useUser } from "@/hooks/useUser";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useUser()

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />
        <main className="flex-1 p-6 bg-white dark:bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}
