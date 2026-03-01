"use client";

import {
  Home,
  CreditCard,
  History,
  Wallet,
  Menu,
  ReceiptText
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import ProtectedRoute from "../utils/ProtectedRoute";
import { useLocale } from "@/context/locale-context";

const mainMenu = [
  { key: "nav.home", href: "/dashboard", icon: Home },
  { key: "nav.wallets", href: "/dashboard/wallets", icon: Wallet },
  { key: "nav.cards", href: "/dashboard/cards", icon: CreditCard },
  { key: "nav.transactions", href: "/dashboard/transactions", icon: History },
  { key: "nav.bills", href: "/dashboard/pay-bill", icon: ReceiptText }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLocale();

  const renderNavItem = (item: any) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.key}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all ${
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        }`}
      >
        <item.icon className="mr-3 h-5 w-5 shrink-0" />
        <span>{t(item.key)}</span>
      </Link>
    );
  };

  return (
    <>
      <ProtectedRoute>
        <div className="fixed left-4 top-4 z-50 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu" className="ff-surface h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-r border-border/70 bg-background p-0">
              <div className="flex h-16 items-center border-b border-border/70 px-6">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center space-x-3">
                  <Image
                    src="/images/finflow.jpg"
                    alt="FinFlow Logo"
                    width={32}
                    height={32}
                    className="rounded-md"
                    priority
                  />
                  <span className="text-xl font-semibold text-foreground">FinFlow</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-1 px-3 py-6">{mainMenu.map(renderNavItem)}</nav>
            </SheetContent>
          </Sheet>
        </div>

        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border/70 bg-background/95 md:flex md:flex-col">
          <div className="flex h-16 items-center border-b border-border/70 px-6">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <Image
                src="/images/finflow.jpg"
                alt="FinFlow Logo"
                width={32}
                height={32}
                className="rounded-md"
                priority
              />
              <span className="text-xl font-semibold text-foreground">FinFlow</span>
            </Link>
          </div>
          <nav className="flex-1 px-3 py-6">
            <div className="space-y-1">{mainMenu.map(renderNavItem)}</div>
          </nav>
        </aside>
      </ProtectedRoute>
    </>
  );
}
