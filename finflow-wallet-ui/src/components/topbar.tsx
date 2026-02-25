export function Topbar() {
  return (
    <header className="topbar">
      <div>
        <p className="topbar-title">Welcome back, Burak</p>
        <p className="muted">Total balance: $24,890.45</p>
      </div>
      <button className="primary-button" type="button">
        + Add Money
      </button>
    </header>
  );
}
