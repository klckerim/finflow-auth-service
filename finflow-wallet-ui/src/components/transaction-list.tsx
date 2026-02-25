const transactions = [
  { name: "Spotify", date: "Today", amount: "-$9.99" },
  { name: "Salary", date: "Yesterday", amount: "+$3,250.00" },
  { name: "Amazon", date: "Mon", amount: "-$148.20" },
  { name: "Transfer from Ayse", date: "Sun", amount: "+$120.00" }
];

export function TransactionList() {
  return (
    <section className="card">
      <h2 className="section-title">Recent transactions</h2>
      <div className="transaction-list">
        {transactions.map((item) => (
          <div className="transaction-item" key={`${item.name}-${item.date}`}>
            <div>
              <p>{item.name}</p>
              <p className="muted small">{item.date}</p>
            </div>
            <p className="metric-value">{item.amount}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
