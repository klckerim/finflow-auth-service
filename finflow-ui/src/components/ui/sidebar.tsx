"use client";

import {
  Home,
  CreditCard,
  History,
  Wallet,
  Repeat,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Menu,
  BarChart2,
  DollarSign,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import ProtectedRoute from "../utils/ProtectedRoute";
import { logout } from "@/lib/auth";

const mainMenu = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Cüzdanlar", href: "/dashboard/wallets", icon: Wallet },
  { name: "Kartlar", href: "/dashboard/cards", icon: CreditCard },
  { name: "Transfer", href: "/dashboard/transfer", icon: Repeat },
  { name: "İşlemler", href: "/dashboard/transactions", icon: History },
  { name: "Analiz", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Döviz Kurları", href: "/dashboard/exchange", icon: DollarSign },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openSettings, setOpenSettings] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const renderNavItem = (item: any) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setIsOpen(false)} // 🔥 burası efsane kritik
        className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
            ? "bg-primary text-white shadow-lg"
            : "hover:bg-muted hover:text-primary"
          }`}
      >
        <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <span className="font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      <ProtectedRoute>
        {/* Mobile Sidebar */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menüyü aç">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-background">
              <div className="h-16 flex items-center px-6 border-b border-muted/30">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center space-x-3">
                  <Image
                    src="/finflow.jpg"
                    alt="FinFlow Logo"
                    width={32}
                    height={32}
                    priority
                  />
                  <span className="text-xl font-bold text-foreground">
                    FinFlow
                  </span>
                </Link>
              </div>
              <nav className="flex flex-col py-6 px-2 space-y-1">
                {mainMenu.map(renderNavItem)}
                <button
                  onClick={() => setOpenSettings(!openSettings)}
                  className="flex items-center w-full px-4 py-3 rounded-lg transition-colors hover:bg-muted"
                  aria-expanded={openSettings}
                  aria-controls="settings-submenu"
                >
                  <Settings className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="flex-1 text-left font-medium">Ayarlar</span>
                  {openSettings ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openSettings && (
                  <div
                    id="settings-submenu"
                    className="ml-8 flex flex-col space-y-1"
                  >
                    <Link
                      href="/dashboard/settings/profile"
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-2 rounded-md transition-colors hover:bg-muted ${pathname === "/dashboard/settings/profile"
                        ? "bg-primary text-white"
                        : ""
                        }`}
                    >
                      Profil
                    </Link>
                    <Link
                      href="/dashboard/settings/security"
                      onClick={() => setIsOpen(false)}

                      className={`px-4 py-2 rounded-md transition-colors hover:bg-muted ${pathname === "/dashboard/settings/security"
                        ? "bg-primary text-white"
                        : ""
                        }`}
                    >
                      Güvenlik
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col fixed top-0 left-0 w-64 h-screen bg-background border-r border-muted/30 z-40">
          <div className="h-16 flex items-center px-6 border-b border-muted/30">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Image
                src="/finflow.jpg"
                alt="FinFlow Logo"
                width={32}
                height={32}
                priority
              />
              <span className="text-xl font-bold text-foreground">FinFlow</span>
            </Link>
          </div>
          <nav className="flex-1 flex flex-col justify-between py-6 px-2">
            <div className="space-y-1">
              {mainMenu.map(renderNavItem)}
              <button
                onClick={() => setOpenSettings(!openSettings)}
                className="flex items-center w-full px-4 py-3 rounded-lg transition-colors hover:bg-muted"
                aria-expanded={openSettings}
                aria-controls="settings-submenu"
              >
                <Settings className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="flex-1 text-left font-medium">Ayarlar</span>
                {openSettings ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {openSettings && (
                <div
                  id="settings-submenu"
                  className="ml-8 flex flex-col space-y-1"
                >
                  <Link
                    href="/dashboard/settings/profile"
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2 rounded-md transition-colors hover:bg-muted ${pathname === "/dashboard/settings/profile"
                      ? "bg-primary text-white"
                      : ""
                      }`}
                  >
                    Profil
                  </Link>
                  <Link
                    href="/dashboard/settings/security"
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2 rounded-md transition-colors hover:bg-muted ${pathname === "/dashboard/settings/security"
                      ? "bg-primary text-white"
                      : ""
                      }`}
                  >
                    Güvenlik
                  </Link>
                </div>
              )}
            </div>
            <div className="border-t border-muted/30 pt-4 px-4 space-y-2">
              <Link
                href="/"
                onClick={logout}
                className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Çıkış Yap
              </Link>
            </div>
          </nav>
        </aside>
      </ProtectedRoute>
    </>
  );
}
