import { Menu } from "lucide-react";

type TopbarProps = {
  onMenuToggle: () => void;
};

export function Topbar({ onMenuToggle }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-main">
        <button aria-label="Open navigation" className="menu-toggle" onClick={onMenuToggle} type="button">
          <Menu size={20} />
        </button>
        <div>
          <p className="topbar-title">Welcome back, Burak</p>
          <p className="muted">Total balance: $24,890.45</p>
        </div>
      </div>
      <button className="primary-button topbar-action" type="button">
        + Add Money
      </button>
    </header>
  );
}
