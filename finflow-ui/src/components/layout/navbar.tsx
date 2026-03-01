"use client";

import ProfileDropdown from "./profiledropdown";
import ProtectedRoute from "../utils/ProtectedRoute";
import { LocaleDropdown } from "./locale-dropdown";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/70 bg-background/90 backdrop-blur md:ml-64">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-end gap-3 px-4 sm:px-6 lg:px-8">
        <LocaleDropdown />
        <ProtectedRoute>
          <ProfileDropdown />
        </ProtectedRoute>
      </div>
    </header>
  );
}
