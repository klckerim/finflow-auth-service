"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, Wallet, History, Send, LogOut } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Cüzdanlar", href: "/wallets", icon: Wallet },
  { name: "İşlemler", href: "/transactions", icon: History },
  { name: "Transfer", href: "/transfer", icon: Send },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const renderLinks = () => (
    <nav className="space-y-2 px-4">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            pathname === item.href
              ? "bg-primary text-white"
              : "hover:bg-muted"
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobil Menü */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="space-y-6 mt-8">
              <div className="text-xl font-semibold px-4">FinFlow</div>
              {renderLinks()}
              <Button variant="ghost" className="w-full mt-6 justify-start px-4">
                <LogOut className="w-5 h-5 mr-3" />
                Çıkış Yap
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] border-r bg-white shadow-sm z-40">
        <div className="px-4 py-6 space-y-6 flex flex-col flex-1">
          <div className="text-2xl font-bold">FinFlow</div>
          {renderLinks()}
          <div className="mt-auto">
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="w-5 h-5 mr-3" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}