"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useFinflowSession } from "@/context/finflow-session";

type TopbarProps = {
  onMenuToggle: () => void;
};

export function Topbar({ onMenuToggle }: TopbarProps) {
  const { session, apiBase, setApiBase } = useFinflowSession();

  return (
    <header className="topbar card">
      <div className="topbar-main">
        <button aria-label="Open navigation" className="menu-toggle" onClick={onMenuToggle} type="button">
          <Menu size={20} />
        </button>
        <div>
          <p className="topbar-title">{session ? `Merhaba, ${session.fullName}` : "FinFlow Wallet Console"}</p>
          <p className="muted">{session ? `${session.email} • ${session.role}` : "API endpointlerini tek yerden yönet"}</p>
        </div>
      </div>
      <div className="topbar-actions">
        <input
          aria-label="API base URL"
          className="input"
          onChange={(event) => setApiBase(event.target.value)}
          value={apiBase}
        />
        <Link className="ghost-button" href={session ? "/dashboard" : "/login"}>
          {session ? "Dashboard" : "Login"}
        </Link>
      </div>
    </header>
  );
}
