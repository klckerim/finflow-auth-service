const rows = [
  {
    id: "TRX-001",
    type: "TransferOut",
    channel: "Wallet → Wallet",
    amount: "-$480.00",
    state: "Idempotent"
  },
  {
    id: "TRX-002",
    type: "Deposit",
    channel: "Stripe Checkout",
    amount: "+$1,200.00",
    state: "Settled"
  },
  {
    id: "TRX-003",
    type: "BillPayment",
    channel: "Electricity Bill",
    amount: "-$90.60",
    state: "Settled"
  },
  {
    id: "TRX-004",
    type: "Payment",
    channel: "Card •••• 9021",
    amount: "-$37.10",
    state: "Pending"
  }
];

export function TransactionList() {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Latest Ledger Entries</h2>
        <button className="text-button" type="button">
          Export CSV
        </button>
      </div>
      <div className="txn-list">
        {rows.map((row) => (
          <article className="txn-row" key={row.id}>
            <div>
              <p>{row.type}</p>
              <p className="tiny muted">
                {row.channel} • {row.id}
              </p>
            </div>
            <div className="txn-right">
              <p className={`txn-amount ${row.amount.startsWith("+") ? "plus" : "minus"}`}>{row.amount}</p>
              <p className="tiny muted">{row.state}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
