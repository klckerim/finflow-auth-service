import { Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="topbar">
      <div>
        <p className="topbar-title">Welcome back, Burak 👋</p>
        <p className="muted">Total balance: $24,890.45</p>
      </div>

      <div className="topbar-actions">
        <label className="search-wrap" htmlFor="wallet-search">
          <Search size={16} />
          <input id="wallet-search" placeholder="Search transaction or card" type="text" />
        </label>
        <button className="primary-button" type="button">
          + Add Money
        </button>
      </div>
    </header>
  );
}
