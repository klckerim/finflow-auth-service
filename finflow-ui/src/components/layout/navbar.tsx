"use client";

import ProfileDropdown from "./profiledropdown";
import ProtectedRoute from "../utils/ProtectedRoute";

export default function Navbar() {
  return (
    <ProtectedRoute>
      <header className="relative h-16 bg-muted/30 left-64 w-[calc(100%-16rem)] z-40">
        <div className="px-6 h-full flex items-center justify-end space-x-4">
          <ProfileDropdown />
        </div>
      </header>
    </ProtectedRoute>
  );
}
