
"use client";

import { logout } from "@/lib/auth"
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const [isLoggedIn] = useState(false); // Geçici auth durumu

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-primary">
        FinFlow
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-6">
        <ThemeToggle />

        {isLoggedIn ? (
          <>
            <Link href="/">Home</Link>
            <Link href="/wallets">Wallets</Link>
            <Link href="/transactions">Transactions</Link>
            <Link href="/about">About</Link>
            <Link href="/profile">Profile</Link>
           
            <Button variant="outline" onClick={logout}>Logout</Button>
          </>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-4 mt-6">
              <ThemeToggle />
              {isLoggedIn ? (
                <>
                  <Link href="/">Home</Link>
                  <Link href="/wallets">Wallets</Link>
                  <Link href="/transactions">Transactions</Link>
                  <Link href="/about">About</Link>
                  <Link href="/profile">Profile</Link>

                  <Button onClick={logout}>Logout</Button>
                </>
              ) : (
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
