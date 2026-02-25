import { ReactNode } from "react";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <Sidebar />
      <main className="workspace">
        <Topbar />
        <div className="stack">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
