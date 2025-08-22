"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/cards/card";
import currencyData from "@/shared/data/currency/currency.json";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Transaction } from "@/shared/types/transaction";

// Constants
const COLORS = ["#22c55e", "#ef4444"]; // green & red
const CHART_INNER_RADIUS = 50;
const CHART_OUTER_RADIUS = 90;
const CHART_PADDING_ANGLE = 4;

interface StatisticsProps {
  transactions: Transaction[];
  currency: string;
  statisticType: string;
}

// Helper functions
const isIncomingTransaction = (transaction: Transaction, type: string): boolean => {
  if (type === "User") {
    return transaction.type === "Deposit";
  }
  return transaction.type === "Deposit" || transaction.type === "TransferIn";
};

const isOutgoingTransaction = (transaction: Transaction, type: string): boolean => {
  if (type === "User") {
    return transaction.type === "Withdraw" || transaction.type === "Payment";
  }
  return transaction.type === "Withdraw" || transaction.type === "Payment" || transaction.type === "TransferOut";
};

const isRelevantTransaction = (transaction: Transaction, statisticType: string): boolean => {
  if (statisticType === "User") {
    return ["Withdraw", "Payment", "Deposit"].includes(transaction.type);
  }
  return ["Withdraw", "Payment", "Deposit", "TransferOut", "TransferIn"].includes(transaction.type);
};

const Statistics = ({ transactions = [], currency = "EUR", statisticType = "" }: StatisticsProps) => {
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [ratesLoading, setRatesLoading] = useState(true);

  const convertCurrency = useCallback((amount: number, from: string, to: string): number => {
    if (from === to) return amount;
    const rateFrom = exchangeRates[from];
    const rateTo = exchangeRates[to];
    if (!rateFrom || !rateTo) return amount;
    return (amount / rateFrom) * rateTo;
  }, [exchangeRates]);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setRatesLoading(true);
        if (currencyData?.rates) {
          setExchangeRates(currencyData.rates);
        }
      } catch (err) {
        console.error("Exchange rates fetch failed", err);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchExchangeRates();
  }, [currency]);

  // Memoized calculations
  const { totalIn, totalOut, transactionCount } = useMemo(() => {
    if (ratesLoading || !transactions.length) {
      return { totalIn: 0, totalOut: 0, transactionCount: 0 };
    }

    const relevantTransactions = transactions.filter(t => isRelevantTransaction(t, statisticType));
    
    const incoming = relevantTransactions
      .filter(t => isIncomingTransaction(t, statisticType))
      .reduce((acc, t) => acc + convertCurrency(t.amount, t.currency, currency), 0);

    const outgoing = relevantTransactions
      .filter(t => isOutgoingTransaction(t, statisticType))
      .reduce((acc, t) => acc + convertCurrency(t.amount, t.currency, currency), 0);

    return {
      totalIn: incoming,
      totalOut: outgoing,
      transactionCount: relevantTransactions.length
    };
  }, [transactions, currency, statisticType, convertCurrency, ratesLoading]);

  const chartData = useMemo(() => [
    { name: "Incoming", value: totalIn },
    { name: "Outgoing", value: Math.abs(totalOut) },
  ], [totalIn, totalOut]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      style: "currency",
      currency,
    });
  };

  // Early return for empty state
  if (!transactions || transactions.length === 0 || ratesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Statistics</CardTitle>
          <CardDescription>Summary of your wallet transactions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6 text-sm text-muted-foreground">
          {ratesLoading ? "Loading data..." : "Not enough data to show statistics yet."}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Statistics</CardTitle>
        <CardDescription>Summary of your wallet transactions</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard 
            label="Total In" 
            value={formatCurrency(totalIn)} 
            valueClassName="text-green-600" 
          />
          
          <KPICard 
            label="Total Out" 
            value={formatCurrency(totalOut)} 
            valueClassName="text-red-600" 
          />
          
          <KPICard 
            label="Transactions" 
            value={transactionCount.toString()} 
          />
        </div>

        {/* Pie Chart */}
        <div className="w-full h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={CHART_OUTER_RADIUS}
                innerRadius={CHART_INNER_RADIUS}
                paddingAngle={CHART_PADDING_ANGLE}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Extracted KPI Card component for better readability
interface KPICardProps {
  label: string;
  value: string;
  valueClassName?: string;
}

const KPICard = ({ label, value, valueClassName = "" }: KPICardProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="p-4 rounded-xl bg-muted/40 border"
  >
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className={`text-xl font-bold ${valueClassName}`}>{value}</p>
  </motion.div>
);

export default Statistics;