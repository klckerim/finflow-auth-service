
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

type MonthlyTrendData = {
  month: string;
  income: number;
  expense: number;
};

interface MonthlyTrendLineChartProps {
  data: MonthlyTrendData[];
}

export default function MonthlyTrendLineChart({ data }: MonthlyTrendLineChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#10b981" />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
