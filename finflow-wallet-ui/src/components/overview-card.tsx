type OverviewCardProps = {
  label: string;
  value: string;
  trend: string;
};

export function OverviewCard({ label, value, trend }: OverviewCardProps) {
  return (
    <article className="card">
      <p className="muted">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="trend">{trend}</p>
    </article>
  );
}
