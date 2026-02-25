import { LucideIcon } from "lucide-react";

type OverviewCardProps = {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
};

export function OverviewCard({ label, value, trend, icon: Icon }: OverviewCardProps) {
  return (
    <article className="card metric-card">
      <div className="metric-head">
        <p className="muted">{label}</p>
        <span className="icon-chip" aria-hidden="true">
          <Icon size={16} />
        </span>
      </div>
      <p className="metric-value">{value}</p>
      <p className="trend">{trend}</p>
    </article>
  );
}
