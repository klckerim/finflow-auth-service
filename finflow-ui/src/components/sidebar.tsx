"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Home, Settings, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function Sidebar({ user }: { user: { name?: string } }) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: <Home size={18} />, label: "Dashboard" },
    { href: "/modules", icon: <Folder size={18} />, label: "Modüller" },
    { href: "/settings", icon: <Settings size={18} />, label: "Ayarlar" },
  ]

  return (
    <div className="w-64 h-screen p-4 bg-muted border-r flex flex-col justify-between fixed">
      <div>
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">Merhaba</p>
          <p className="font-semibold">{user?.name || "Kullanıcı"}</p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 ${pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
      <Button variant="ghost" onClick={() => signOut()} className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive">
        <LogOut size={18} />
        Çıkış Yap
      </Button>
    </div>
  )
}
