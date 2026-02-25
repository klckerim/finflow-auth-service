import { LucideIcon } from "lucide-react";

type OverviewCardProps = {
  title: string;
  value: string;
  meta: string;
  icon: LucideIcon;
};

export function OverviewCard({ title, value, meta, icon: Icon }: OverviewCardProps) {
  return (
    <article className="metric">
      <div className="metric-head">
        <p className="tiny muted">{title}</p>
        <span className="chip" aria-hidden="true">
          <Icon size={16} />
        </span>
      </div>
      <p className="metric-value">{value}</p>
      <p className="tiny">{meta}</p>
    </article>
  );
}
