"use client";

import Link from "next/link";
import { CreditCard, Home, Repeat, Settings, Wallet, X } from "lucide-react";
import { usePathname } from "next/navigation";

type SidebarProps = {
  isOpen: boolean;
  onNavigate: () => void;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/wallet", label: "Wallets API", icon: Wallet },
  { href: "/cards", label: "Cards & Setup", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: Repeat },
  { href: "/settings", label: "Auth + Payments", icon: Settings }
];

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`sidebar-panel ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div>
          <p className="brand-title">FinFlow Wallet UI</p>
          <p className="muted">Modern API connected panel</p>
        </div>
        <button aria-label="Close menu" className="menu-close" onClick={onNavigate} type="button">
          <X size={18} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            className={`sidebar-link ${pathname === href ? "active" : ""}`}
            href={href}
            onClick={onNavigate}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
