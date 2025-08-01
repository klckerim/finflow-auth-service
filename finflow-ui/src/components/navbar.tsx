
"use client";

import { logout } from "@/lib/auth"
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { useUser } from "@/hooks/useUser";


export default function Navbar() {
  
  return (
    <nav className="fixed w-full h-16 bg-white dark:bg-gray-900 border-b shadow-sm flex items-center justify-between px-6 z-50">
      <Link href="/" className="text-xl font-bold text-primary">FinFlow</Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
  );
}


function UserMenu() {
  const { user } = useUser();
  if (!user) return <Link href="/login"><Button>Giriş Yap</Button></Link>;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{user.fullname}</span>
      <Button variant="ghost" onClick={logout}>Çıkış</Button>
    </div>
  );
}

