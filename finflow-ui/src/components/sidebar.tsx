"use client";

import {
  Home,
  CreditCard,
  History,
  Users,
  FileText,
  Banknote,
  Receipt,
  LogOut,
  ChevronDown,
  ChevronUp,
  Menu,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const mainMenu = [
  { name: "Ana Sayfa", href: "/dashboard", icon: Home },
  { name: "Kartlar", href: "/cards", icon: CreditCard },
  { name: "İşlemler", href: "/transactions", icon: History },
  { name: "Alıcılar", href: "/recipients", icon: Users },
  { name: "Özet", href: "/summary", icon: FileText },
];

const paymentsSubmenu = [
  { name: "Ödeme Talepleri", href: "/payments/requests", icon: Receipt },
  { name: "Fatura Bölüşme", href: "/payments/split", icon: Banknote },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openPayments, setOpenPayments] = useState(false);

  const renderNavItem = (item: any) => (
    <Link
      key={item.name}
      href={item.href}
      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
        pathname === item.href ? "bg-primary text-white" : "hover:bg-muted"
      }`}
    >
      <item.icon className="w-5 h-5 mr-3" />
      {item.name}
    </Link>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="h-16 flex items-center px-4 border-b">
              <Link href="/" className="flex items-center space-x-3">
                <Image src="/finflow.jpg" alt="Logo" width={32} height={32} />
                <span className="text-lg font-semibold">FinFlow</span>
              </Link>
            </div>
            <div className="py-6 px-4 space-y-2">
              {mainMenu.map(renderNavItem)}
              <button
                onClick={() => setOpenPayments(!openPayments)}
                className="flex items-center w-full px-4 py-2 rounded-lg transition-colors hover:bg-muted"
              >
                <Banknote className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">Ödemeler</span>
                {openPayments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openPayments && (
                <div className="ml-8 space-y-1">
                  {paymentsSubmenu.map(renderNavItem)}
                </div>
              )}
              <Button variant="ghost" className="w-full justify-start mt-6">
                <LogOut className="w-5 h-5 mr-3" />
                Çıkış Yap
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col fixed top-0 left-0 w-64 h-screen bg-muted/30 z-40">
        <div className="h-16 flex items-center px-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/finflow.jpg" alt="FinFlow Logo" width={32} height={32} />
            <span className="text-lg font-semibold">FinFlow</span>
          </Link>
        </div>
        <div className="flex flex-col justify-between h-full py-6">
          <nav className="space-y-1 px-4">
            {mainMenu.map(renderNavItem)}
            <button
              onClick={() => setOpenPayments(!openPayments)}
              className="flex items-center w-full px-4 py-2 rounded-lg transition-colors hover:bg-muted"
            >
              <Banknote className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">Ödemeler</span>
              {openPayments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openPayments && (
              <div className="ml-8 space-y-1">
                {paymentsSubmenu.map(renderNavItem)}
              </div>
            )}
          </nav>
          <div className="px-4 mt-auto">
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
