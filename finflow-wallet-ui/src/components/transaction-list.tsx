const transactions = [
  { name: "Spotify", date: "Today, 09:12", category: "Subscription", amount: "-$9.99" },
  { name: "Salary", date: "Yesterday, 18:20", category: "Income", amount: "+$3,250.00" },
  { name: "Amazon", date: "Mon, 11:49", category: "Shopping", amount: "-$148.20" },
  { name: "Transfer from Ayşe", date: "Sun, 20:41", category: "Transfer", amount: "+$120.00" }
];

export function TransactionList() {
  return (
    <section className="card">
      <div className="section-header">
        <h2 className="section-title">Recent transactions</h2>
        <button className="text-button" type="button">
          View all
        </button>
      </div>
      <div className="transaction-list">
        {transactions.map((item) => (
          <article className="transaction-item" key={`${item.name}-${item.date}`}>
            <div>
              <p className="tile-title">{item.name}</p>
              <p className="muted small">{item.category} • {item.date}</p>
            </div>
            <p className={`metric-value compact ${item.amount.startsWith("+") ? "positive" : "negative"}`}>
              {item.amount}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
