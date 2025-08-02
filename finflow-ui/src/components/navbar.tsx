// components/Navbar.tsx
/**
 * Main navigation bar - Fixed at top.
 * Contains logo, app name, theme toggle, and profile dropdown.
 */
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProfileDropdown from "./profiledropdown";
import ThemeToggle from "./theme-toggle";

const Navbar = () => {
  return (
    <header className="fixed top-0 w-full bg-background z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="flex items-center space-x-3">
              <Image 
                src="/finflow.jpg" 
                alt="FinFlow Logo"
                width={36}
                height={36}
              />
              <span className="text-xl font-bold">FinFlow</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Navbar;