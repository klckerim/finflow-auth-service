
export default function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl p-4 shadow-sm border">
      <div className="text-gray-600 text-sm">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
