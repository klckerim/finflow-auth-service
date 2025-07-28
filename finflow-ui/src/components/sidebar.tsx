
import Link from "next/link";
import { Home, Wallet, Send, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/wallets", label: "Cüzdanlar", icon: Wallet },
  { href: "/dashboard/transfer", label: "Transfer", icon: Send },
  { href: "/dashboard/settings", label: "Ayarlar", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="h-full w-60 bg-white border-r shadow-sm hidden md:block">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 text-sm">
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
