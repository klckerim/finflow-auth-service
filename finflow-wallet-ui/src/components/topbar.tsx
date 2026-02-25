import { BellRing, Search, Sparkles } from "lucide-react";

export function Topbar() {
  return (
    <header className="topbar">
      <div>
        <p className="muted tiny">Good afternoon</p>
        <h1 className="hero-title">Wallet Operations Hub</h1>
      </div>

      <div className="topbar-actions">
        <label className="search" htmlFor="global-search">
          <Search size={16} />
          <input id="global-search" placeholder="Search wallet, card, txn id..." type="text" />
        </label>
        <button className="ghost-icon" type="button" aria-label="Notifications">
          <BellRing size={16} />
        </button>
        <button className="cta" type="button">
          <Sparkles size={16} />
          Run Stripe Top-up
        </button>
      </div>
    </header>
  );
}
