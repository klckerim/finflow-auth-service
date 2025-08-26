"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/features/cards/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/layout/skeleton";
import { Button } from "@/components/ui/button";

import QuickActions from "@/features/dashboard/quickactions";
import AnalyticsWidget from "@/features/dashboard/AnalyticsWidget";

import { useAuth } from "@/context/auth-context";
import { getTransactionsByUserId, getWalletsByUser } from "@/shared/lib/api";
import { getGreeting } from "@/components/ui/label";
import currencyData from "@/shared/data/currency/currency.json";

import { Wallet } from "@/shared/types/wallet";
import { parseUnknownError } from "@/shared/lib/api-error-handler";
import Statistics from "@/components/ui/statistic";
import { useLocale } from "@/context/locale-context";

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { t } = useLocale();

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

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
      ("quotes.str1"),
      ("quotes.str2"),
      ("quotes.str3"),
      ("quotes.str4")
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

  useEffect(() => {
    (async () => {
      try {
        if (!user) return;
        const response = await getTransactionsByUserId(user.userId, 1000);
        setTransactions(response);
      } catch (err) {
        parseUnknownError(err);
      } finally {
        setTransactionsLoading(false);
      }
    })();
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
        console.error(t("warningsMessages.ratesFetchFailed"), err);
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
      <main className="flex flex-col gap-12 px-4 sm:px-8 md:px-16 py-10 max-w-screen-2xl mx-auto text-gray-900 dark:text-gray-100">
        {/* HEADER */}
        <header className="space-y-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("dashboard.welcome", { name: user.fullName })}
          </h1>
          <p className="text-lg sm:text-xl font-medium text-primary">{greeting}</p>
          <p className="text-base text-muted-foreground dark:text-gray-400">
            {t("common.str_ManageYourWallets")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <label htmlFor="currency-select" className="text-sm font-medium">
              {t("common.currency")}:
            </label>
            <select
              id="currency-select"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="border px-3 py-1 rounded-md bg-white dark:bg-zinc-800 dark:text-gray-100 dark:border-gray-700"
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
          <Card className="hover:shadow-md transition dark:bg-zinc-900 dark:border-gray-700">
            <CardHeader><CardTitle>{t("dashboard.numberOfWallets")}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{wallets.length}</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition dark:bg-zinc-900 dark:border-gray-700">
            <CardHeader><CardTitle>{t("dashboard.totalBalance")} ({baseCurrency})</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {totalBalance.toLocaleString("tr-TR", { style: "currency", currency: baseCurrency })}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition dark:bg-zinc-900 dark:border-gray-700">
            <CardHeader><CardTitle>{t("dashboard.expenseLimit")}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                {spendingUsed.toLocaleString("tr-TR", { style: "currency", currency: baseCurrency })} /{" "}
                {spendingLimit.toLocaleString("tr-TR", { style: "currency", currency: baseCurrency })}
              </p>
              <Progress value={progressPercent} />
            </CardContent>
          </Card>
        </section>

        {/* CÜZDANLAR */}
        {wallets.length === 0 ? (
          <div className="text-center p-6 border-2 border-dashed rounded-lg dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-2">{t("common.str_NoWallets")}</h2>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">{t("common.str_CreateNewWallet")}</p>
            <Button onClick={() => router.push("/dashboard/wallets/add")}>{t("dashboard.createWallet")}</Button>
          </div>
        ) : (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet) => {
              const converted = convertCurrency(wallet.balance, wallet.currency, baseCurrency);
              return (
                <Card key={wallet.id} className="hover:shadow-md transition dark:bg-zinc-900 dark:border-gray-700">
                  <CardHeader><CardTitle>{wallet.name}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold">
                      {wallet.balance.toLocaleString("en-EN", {
                        style: "currency",
                        currency: wallet.currency,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
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
          <Card className="dark:bg-zinc-900 dark:border-gray-700">
            <CardContent>
              <Statistics
                transactions={transactions ?? []}
                currency={baseCurrency ?? "EUR"}
                statisticType={"User"}
              />
            </CardContent>
          </Card>
        </section>

        {/* HIZLI İŞLEMLER */}
        <QuickActions />
        <AnalyticsWidget />

        {/* ALT BUTONLAR */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {user ? (
            <Button variant="outline" onClick={logout}>🚪 {t("dashboard.logout")}</Button>
          ) : (
            <>
              <Button onClick={() => router.push("/register")}>🚀 {t("dashboard.signup")}</Button>
              <Button variant="outline" onClick={() => router.push("/login")}>🔐 {t("dashboard.signin")}</Button>
            </>
          )}
        </div>
        <footer className="text-center text-sm italic text-muted-foreground dark:text-gray-400 mt-10">"{t(quote)}"</footer>
      </main>
    </ProtectedRoute>
  );
}
