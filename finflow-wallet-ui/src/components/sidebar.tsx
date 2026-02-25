import Link from "next/link";
import { CreditCard, Home, Repeat, Settings, Wallet } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: Repeat },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="sidebar-panel">
      <div>
        <p className="brand-title">FinFlow Wallet</p>
        <p className="muted">Yeni nesil dijital cüzdan</p>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} className="sidebar-link" href={href}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
