"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CreditCard, Home, Repeat, Settings, Wallet } from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: Repeat },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-panel">
      <div>
        <p className="brand-title">FinFlow Wallet</p>
        <p className="muted">Yeni nesil dijital cüzdan deneyimi</p>
      </div>

      <div className="profile-tile">
        <div className="avatar">BY</div>
        <div>
          <p className="tile-title">Burak Y.</p>
          <p className="muted small">Premium member</p>
        </div>
        <button aria-label="Notifications" className="icon-button" type="button">
          <Bell size={16} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} className={`sidebar-link ${isActive ? "active" : ""}`} href={href}>
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
