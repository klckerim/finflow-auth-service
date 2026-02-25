import { AppShell } from "@/components/app-shell";

export default function CardsPage() {
  return (
    <AppShell>
      <section className="split-grid">
        <article className="card gradient-card">
          <p className="muted">Primary card</p>
          <p className="metric-value">•••• 2244</p>
          <p className="muted small">Valid thru 09/29</p>
        </article>

        <article className="card">
          <h1 className="section-title">Card controls</h1>
          <div className="action-grid">
            <button className="ghost-button" type="button">Freeze card</button>
            <button className="ghost-button" type="button">Set limit</button>
            <button className="ghost-button" type="button">Reveal CVV</button>
            <button className="ghost-button" type="button">Virtual card</button>
          </div>
        </article>
      </section>
    </AppShell>
  );
}
