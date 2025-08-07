"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import QuickActions from "@/components/ui/quickactions";
import AnalyticsWidget from "@/components/ui/AnalyticsWidget";

import { useAuth } from "@/context/auth-context";
import { getWalletsByUser } from "@/lib/api";
import { getGreeting } from "@/components/ui/label";
import currencyData from "@/data/currency/currency.json";

import { Wallet } from "@/types/wallet";
import { expensesData, mockMonthlyTrendData } from "@/data/mock/data";
import { parseUnknownError } from "@/lib/api-error-handler";

const ExpensesPieChart = dynamic(() => import("@/components/charts/expenses-pie-chart"));
const MonthlyTrendLineChart = dynamic(() => import("@/components/charts/monthly-trend-line-chart"));

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [ratesLoading, setRatesLoading] = useState(true);

  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [quote, setQuote] = useState("");
  const greeting = getGreeting();

  // Auth kontrolü
  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    const quotes = [
      "Today's plan is tomorrow's success.",
      "Manage your money, shape your future.",
      "Small steps make big differences.",
      "Financial freedom is a habit."
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Cüzdanları çek
  useEffect(() => {
    if (user) {
      (async () => {
        try {
          setWalletsLoading(true);
          const response = await getWalletsByUser(user.userId);
          setWallets(response);
        } catch (err) {
          parseUnknownError(err);
        } finally {
          setWalletsLoading(false);
        }
      })();
    }
  }, [user]);

  // Kur verisini al
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
  }, [baseCurrency]);

  function convertCurrency(amount: number, from: string, to: string): number {
    if (from === to) return amount;
    const rateFrom = exchangeRates[from];
    const rateTo = exchangeRates[to];
    if (!rateFrom || !rateTo) return amount;
    return (amount / rateFrom) * rateTo;
  }

  const totalBalance = wallets.reduce(
    (acc, w) => acc + convertCurrency(w.balance, w.currency, baseCurrency),
    0
  );

  const spendingLimit = convertCurrency(10000, "EUR", baseCurrency);
  const spendingUsed = Math.min(totalBalance, spendingLimit);
  const progressPercent = Math.min((spendingUsed / spendingLimit) * 100, 100);
  const availableCurrencies = Object.keys(exchangeRates).sort();

  if (isLoading || !user || walletsLoading || ratesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Skeleton className="h-12 w-1/2" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="flex flex-col gap-12 px-4 sm:px-8 md:px-16 py-10 max-w-screen-2xl mx-auto">
        {/* HEADER */}
        <header className="space-y-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome to FinFlow{user ? `, ${user.fullName}` : ""}
          </h1>
          <p className="text-lg sm:text-xl font-medium text-primary">{greeting}</p>
          <p className="text-base text-muted-foreground">
            Manages their wallets, tracks their cards, and stays financially accessible.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <label htmlFor="currency-select" className="text-sm font-medium">
              Currency:
            </label>
            <select
              id="currency-select"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="border px-3 py-1 rounded-md dark:bg-zinc-800"
            >
              {availableCurrencies.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* METRİKLER */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition">
            <CardHeader><CardTitle>Number of Wallets</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{wallets.length}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition">
            <CardHeader><CardTitle>Total Balance ({baseCurrency})</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {totalBalance.toLocaleString("tr-TR", { style: "currency", currency: baseCurrency })}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition">
            <CardHeader><CardTitle>Expenses Limit</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {spendingUsed.toLocaleString("tr-TR", { style: "currency", currency: baseCurrency })} /{" "}
                {spendingLimit.toLocaleString("tr-TR", { style: "currency", currency: baseCurrency })}
              </p>
              <Progress value={progressPercent} />
            </CardContent>
          </Card>
        </section>

        {/* CÜZDANLAR */}
        {wallets.length === 0 ? (
          <div className="text-center p-6 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold mb-2">You don't have a wallet yet.</h2>
            <p className="text-sm text-muted-foreground mb-4">You can start by creating a new wallet.</p>
            <Button onClick={() => router.push("/dashboard/wallets/add")}>Create A Wallet</Button>
          </div>
        ) : (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet) => {
              const converted = convertCurrency(wallet.balance, wallet.currency, baseCurrency);
              return (
                <Card key={wallet.id} className="hover:shadow-md transition">
                  <CardHeader><CardTitle>{wallet.name}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold">
                      {wallet.balance.toLocaleString("en-EN", {
                        style: "currency",
                        currency: wallet.currency,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ({converted.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: baseCurrency,
                      })} {baseCurrency})
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}

        {/* GRAFİKLER */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Expenses</CardTitle></CardHeader>
            <CardContent><ExpensesPieChart data={expensesData} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Monthly Trend</CardTitle></CardHeader>
            <CardContent><MonthlyTrendLineChart data={mockMonthlyTrendData} /></CardContent>
          </Card>
        </section>

        {/* HIZLI İŞLEMLER */}
        <QuickActions />
        <AnalyticsWidget />

        {/* ALT BUTONLAR */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {user ? (
            <Button variant="outline" onClick={logout}>🚪 Logout</Button>
          ) : (
            <>
              <Button onClick={() => router.push("/register")}>🚀 Sign Up</Button>
              <Button variant="outline" onClick={() => router.push("/login")}>🔐 Sign In</Button>
            </>
          )}
        </div>
        <footer className="text-center text-sm italic text-muted-foreground mt-10">"{quote}"</footer>
      </main>
    </ProtectedRoute>
  );
}
