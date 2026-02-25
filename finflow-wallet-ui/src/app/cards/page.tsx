import { AppShell } from "@/components/app-shell";

const cards = [
  { brand: "Visa", tail: "9021", exp: "09/29", default: "Default" },
  { brand: "Mastercard", tail: "1284", exp: "11/28", default: "Backup" }
];

export default function CardsPage() {
  return (
    <AppShell>
      <section className="bento-grid">
        <article className="panel accent-panel">
          <p className="tiny">PaymentMethodDto</p>
          <h2>Linked Stripe Cards</h2>
          <p className="muted">Manage cards returned by /Cards/user/{`{userId}`}</p>
        </article>

        <article className="panel">
          <h2>Card Actions</h2>
          <div className="button-grid">
            <button className="subtle" type="button">Create setup session</button>
            <button className="subtle" type="button">Set as default</button>
            <button className="subtle" type="button">Disable card</button>
            <button className="subtle" type="button">Inspect card transactions</button>
          </div>
        </article>
      </section>

      <section className="vault-grid">
        {cards.map((card) => (
          <article className="panel card-surface" key={card.tail}>
            <p className="tiny muted">{card.default}</p>
            <h3>{card.brand} •••• {card.tail}</h3>
            <p className="tiny">Exp {card.exp}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
