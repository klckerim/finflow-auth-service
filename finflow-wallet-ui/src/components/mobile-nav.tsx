"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/sidebar";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-dock" aria-label="Mobile Navigation">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;

        return (
          <Link className={`dock-link ${active ? "active" : ""}`} href={href} key={href}>
            <Icon size={18} />
            <span>{label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
