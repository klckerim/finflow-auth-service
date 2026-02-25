"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  CreditCard,
  Gauge,
  Landmark,
  ShieldCheck,
  WalletCards
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Command Center", icon: Gauge },
  { href: "/wallet", label: "Wallet Vaults", icon: Landmark },
  { href: "/cards", label: "Payment Methods", icon: WalletCards },
  { href: "/transactions", label: "Ledger", icon: ArrowLeftRight },
  { href: "/settings", label: "Security & Profile", icon: ShieldCheck }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="rail">
      <div className="brand-block">
        <span className="logo-orb" aria-hidden="true" />
        <div>
          <p className="brand">FinFlow Nova</p>
          <p className="muted tiny">API-driven wallet workspace</p>
        </div>
      </div>

      <article className="glass-block">
        <p className="tiny muted">User Role</p>
        <h3>Financial Operator</h3>
        <p className="tiny">JWT + Refresh Token protected session</p>
      </article>

      <nav className="rail-nav">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link className={`rail-link ${active ? "active" : ""}`} href={href} key={href}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <article className="glass-block hide-mobile">
        <p className="tiny muted">Cards</p>
        <div className="card-mini">
          <CreditCard size={18} />
          <p>Visa •••• 9021</p>
        </div>
      </article>
    </aside>
  );
}
