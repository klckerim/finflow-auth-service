"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={isMenuOpen} onNavigate={() => setIsMenuOpen(false)} />
      {isMenuOpen ? <button aria-label="Close menu" className="sidebar-backdrop" onClick={() => setIsMenuOpen(false)} type="button" /> : null}
      <main className="main-content">
        <Topbar onMenuToggle={() => setIsMenuOpen((prev) => !prev)} />
        {children}
      </main>
    </div>
  );
}
