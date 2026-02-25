import Link from "next/link";
import { CreditCard, Home, Repeat, Settings, Wallet, X } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onNavigate: () => void;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: Repeat },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  return (
    <aside className={`sidebar-panel ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div>
          <p className="brand-title">FinFlow Wallet</p>
          <p className="muted">Yeni nesil dijital cüzdan</p>
        </div>
        <button aria-label="Close menu" className="menu-close" onClick={onNavigate} type="button">
          <X size={18} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} className="sidebar-link" href={href} onClick={onNavigate}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
