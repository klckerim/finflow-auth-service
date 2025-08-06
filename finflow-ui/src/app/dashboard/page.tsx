"use client";

import AnalyticsWidget from "@/components/ui/AnalyticsWidget";
import QuickActions from "@/components/ui/quickactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getWalletsByUser } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Wallet } from "@/types/wallet";
import currencyData from "@/data/currency/currency.json";
import { getGreeting } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { expensesData, mockMonthlyTrendData } from "@/data/mock/data";
import { Button } from "@/components/ui/button";

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
  const greeting = getGreeting();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    const quotes = [
      "Bugünün planı, yarının başarısıdır.",
      "Paranı yönet, geleceğini şekillendir.",
      "Küçük adımlar, büyük farklar yaratır.",
      "Finansal özgürlük bir alışkanlıktır.",
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          setWalletsLoading(true);
          const response = await getWalletsByUser(user.userId);
          setWallets(response);
        } catch (err) {
          console.error("Wallets fetch failed", err);
        } finally {
          setWalletsLoading(false);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        setRatesLoading(true);
        if (currencyData && currencyData.rates) setExchangeRates(currencyData.rates);
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
    const amountInBase = amount / rateFrom;
    return amountInBase * rateTo;
  }

  const totalBalance = wallets.reduce((acc, w) => acc + convertCurrency(w.balance, w.currency, baseCurrency), 0);
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
      <main className="flex flex-col gap-10 px-6 py-10 md:px-16 max-w-screen-2xl mx-auto bg-gradient-to-br from-zinc-50 to-white dark:from-black dark:to-zinc-900">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            FinFlow'a Hoş Geldin{user ? `, ${user.fullName}` : ""}
          </h1>
          <p className="text-2xl text-primary font-medium">{greeting}</p>
          <p className="text-lg text-muted-foreground">
            Cüzdanlarını yönet, kartlarını takip et ve finansal hedeflerine ulaş.
          </p>
          <div className="flex justify-center items-center gap-4">
            <label htmlFor="currency-select" className="font-medium">
              Para Birimi:
            </label>
            <select
              id="currency-select"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="border px-3 py-1 rounded-md dark:bg-zinc-800"
            >
              {availableCurrencies.map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg">
            <CardHeader><CardTitle>Cüzdan Sayısı</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{wallets.length}</p></CardContent>
          </Card>
          <Card className="hover:shadow-lg">
            <CardHeader><CardTitle>Toplam Bakiye ({baseCurrency})</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{totalBalance.toLocaleString("tr-TR", { style: "currency", currency: baseCurrency })}</p></CardContent>
          </Card>
          <Card className="hover:shadow-lg">
            <CardHeader><CardTitle>Harcama Limiti</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {spendingUsed.toLocaleString("tr-TR", { style: "currency", currency: baseCurrency })} / {spendingLimit.toLocaleString("tr-TR", { style: "currency", currency: baseCurrency })}
              </p>
              <Progress value={progressPercent} />
            </CardContent>
          </Card>
        </section>

        {wallets.length === 0 ? (
          <div className="text-center p-6 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Henüz cüzdanın yok</h2>
            <p className="text-sm text-muted-foreground mb-4">Yeni bir cüzdan oluşturarak başlayabilirsin.</p>
            <button onClick={() => router.push("/dashboard/wallets/add")} className="bg-primary text-white px-4 py-2 rounded-md hover:scale-105 transition">
              Cüzdan Oluştur
            </button>
          </div>
        ) : (
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet) => {
              const convertedBalance = convertCurrency(wallet.balance, wallet.currency, baseCurrency);
              return (
                <Card key={wallet.id} className="hover:scale-105 transition-transform">
                  <CardHeader><CardTitle>{wallet.name}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold">{wallet.balance.toLocaleString("tr-TR", { style: "currency", currency: wallet.currency })}</p>
                    <p className="text-sm text-muted-foreground">
                      ({convertedBalance.toLocaleString("tr-TR", { style: "currency", currency: baseCurrency })} {baseCurrency})
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}

        <section className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader><CardTitle>Harcamalar</CardTitle></CardHeader>
            <CardContent><ExpensesPieChart data={expensesData} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Aylık Trend</CardTitle></CardHeader>
            <CardContent><MonthlyTrendLineChart data={mockMonthlyTrendData} /></CardContent>
          </Card>
        </section>
        <QuickActions />
        <AnalyticsWidget />

        <section className="flex flex-wrap justify-center gap-4">
          {user ? (
            <>
              <Button variant="outline" onClick={logout}>🚪 Çıkış Yap</Button>
            </>
          ) : (
            <>
              <Button onClick={() => router.push("/register")}>🚀 Kayıt Ol</Button>
              <Button variant="outline" onClick={() => router.push("/login")}>🔐 Giriş Yap</Button>
            </>
          )}
        </section>



        <section className="text-center italic text-muted-foreground">
          "{quote}"
        </section>


      </main>
    </ProtectedRoute>
  );
}
