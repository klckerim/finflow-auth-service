"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Home, Settings, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/wallets", label: "Cüzdanlar" },
    { href: "/transactions", label: "İşlemler" },
    { href: "/transfer", label: "Transfer" },
    { href: "/profile", label: "Profilim" },
  ];

  

  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white dark:bg-gray-900 border-r px-4 py-6 space-y-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/10 transition ${pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
