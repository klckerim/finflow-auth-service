"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/cards/card";
import currencyData from "@/shared/data/currency/currency.json";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Transaction } from "@/shared/types/transaction";

interface StatisticsProps {
    transactions: Transaction[];
    currency: string;
    statisticType: string
}

const Statistics = ({ transactions = [], currency = "EUR", statisticType = "" }: StatisticsProps) => {
    if (!transactions || transactions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>📊 Statistics</CardTitle>
                    <CardDescription>Summary of your wallet transactions</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                    Not enough data to show statistics yet.
                </CardContent>
            </Card>
        );
    }
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
    const [ratesLoading, setRatesLoading] = useState(true);

    function convertCurrency(amount: number, from: string, to: string): number {
        if (from === to) return amount;
        const rateFrom = exchangeRates[from];
        const rateTo = exchangeRates[to];
        if (!rateFrom || !rateTo) return amount;
        return (amount / rateFrom) * rateTo;
    }

    useEffect(() => {
        (async () => {
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
        })();
    }, [currency]);

    const isIncoming = (t: Transaction, type: string) =>
        type === "User"
            ? t.type === "Deposit"
            : t.type === "Deposit" || t.type === "TransferIn";

    const isOutgoing = (t: Transaction, type: string) =>
        type === "User"
            ? t.type === "Withdraw" || t.type === "Payment"
            : t.type === "Withdraw" || t.type === "Payment" || t.type === "TransferOut";

    const totalIn = transactions
        .filter(t => isIncoming(t, statisticType))
        .reduce((acc, t) => acc + convertCurrency(t.amount, t.currency, currency), 0);

    const totalOut = transactions
        .filter(t => isOutgoing(t, statisticType))
        .reduce((acc, t) => acc + convertCurrency(t.amount, t.currency, currency), 0);

    const data = [
        { name: "Incoming", value: totalIn },
        { name: "Outgoing", value: totalOut * -1 },
    ];

    const COLORS = ["#22c55e", "#ef4444"]; // green & red

    return (
        <Card>
            <CardHeader>
                <CardTitle>📊 Statistics</CardTitle>
                <CardDescription>Summary of your wallet transactions</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-4 rounded-xl bg-muted/40 border"
                    >
                        <p className="text-sm text-muted-foreground">Total In</p>
                        <p className="text-xl font-bold text-green-600">
                            {totalIn.toLocaleString(undefined, {
                                style: "currency",
                                currency,
                            })}
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-4 rounded-xl bg-muted/40 border"
                    >
                        <p className="text-sm text-muted-foreground">Total Out</p>
                        <p className="text-xl font-bold text-red-600">
                            {totalOut.toLocaleString(undefined, {
                                style: "currency",
                                currency,
                            })}
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-4 rounded-xl bg-muted/40 border"
                    >
                        <p className="text-sm text-muted-foreground">Transactions</p>
                        <p className="text-xl font-bold">{transactions.length}</p>
                    </motion.div>
                </div>

                {/* Pie Chart */}
                <div className="w-full h-64">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={90}
                                innerRadius={50}
                                paddingAngle={4}
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) =>
                                    value.toLocaleString(undefined, {
                                        style: "currency",
                                        currency,
                                    })
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default Statistics;
