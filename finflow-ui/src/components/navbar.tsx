import ProfileDropdown from "./profiledropdown";


export default function Navbar() {
  return (
    <header className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-muted/30 z-40">
      <div className="px-6 h-full flex items-center justify-end space-x-4">
        <ProfileDropdown />
      </div>
    </header>
  );
}
