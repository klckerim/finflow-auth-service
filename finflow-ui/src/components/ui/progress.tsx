
interface ProgressProps {
  value: number; // 0-100 arası
}

export function Progress({ value }: ProgressProps) {
  return (
    <div className="w-full bg-gray-200 rounded h-3">
      <div
        className="bg-blue-600 h-3 rounded transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
