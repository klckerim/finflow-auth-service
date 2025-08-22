"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, Repeat, User, } from "lucide-react";
import ProtectedRoute from "../utils/ProtectedRoute";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Wallets", href: "/dashboard/wallets", icon: Wallet },
  { name: "Transactions", href: "/dashboard/transactions", icon: Repeat },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-muted/30 shadow-sm">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center text-xs font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                >
                  <item.icon className="w-5 h-5 mb-1" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </ProtectedRoute>
  );
}
