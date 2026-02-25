"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/sidebar";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav" aria-label="Mobile Navigation">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link className={`mobile-nav-link ${isActive ? "active" : ""}`} href={href} key={href}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
