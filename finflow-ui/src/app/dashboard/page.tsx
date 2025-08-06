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
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Wallet } from "@/types/wallet";
import currencyData from "@/data/currency/currency.json";
import { getGreeting } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { expensesData, mockMonthlyTrendData } from "@/data/mock/data";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXCHANGE_API = "https://data.fixer.io/api/latest";
const ACCESS_KEY = "YOUR_ACCESS_KEY" //https://fixer.io/


const ExpensesPieChart = dynamic(() => import("@/components/charts/expenses-pie-chart"));
const MonthlyTrendLineChart = dynamic(() => import("@/components/charts/monthly-trend-line-chart"));

export default function DashboardPage() {
  const { user, isLoading , logout} = useAuth();
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [ratesLoading, setRatesLoading] = useState(true);
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const greeting = getGreeting();
  const [quote, setQuote] = useState("");

  // Fetch wallets
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
        // const today = new Date().toISOString().split("T")[0];
        // const res = await fetch(
        //   `${EXCHANGE_API}?access_key=${ACCESS_KEY}&base=${baseCurrency}&date=${today}`
        // );
        // console.log("api fetched");
        // const data = await res.json();
        // if (data && data.rates) setExchangeRates(data.rates);

        if (currencyData && currencyData.rates) setExchangeRates(currencyData.rates);
      } catch (err) {
        console.error("Exchange rates fetch failed", err);
      } finally {
        setRatesLoading(false);
      }
    })();
  }, [baseCurrency]);

  // Döviz dönüşümü fonksiyonu
  function convertCurrency(amount: number, from: string, to: string): number {
    if (from === to) return amount;
    const rateFrom = exchangeRates[from];
    const rateTo = exchangeRates[to];

    // Eğer kur yoksa dönüşüm yapma
    if (!rateFrom || !rateTo) return amount;

    // Önce base currency'ye çevir, sonra hedefe
    const amountInBase = amount / rateFrom;
    return amountInBase * rateTo;
  }

  // Tüm cüzdanların toplam bakiyesi baseCurrency'ye göre
  const totalBalance = wallets.reduce((acc, w) => {
    return acc + convertCurrency(w.balance, w.currency, baseCurrency);
  }, 0);

  const spendingLimit = convertCurrency(10000, "EUR", baseCurrency);
  const spendingUsed = Math.min(totalBalance, spendingLimit);
  const progressPercent = Math.min((spendingUsed / spendingLimit) * 100, 100);

  const availableCurrencies = Object.keys(exchangeRates).sort();

  if (isLoading || !user || walletsLoading || ratesLoading) {
    return (
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6 pt-20 space-y-6 animate-pulse">
          <Skeleton className="h-8 w-[300px]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-48" />
        </main>
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12 transition-colors duration-500">
        <main className="flex-1 p-6 pt-20 overflow-y-auto bg-gradient-to-br from-zinc-50 to-white dark:from-black dark:to-zinc-900">

          <section className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              FinFlow'a Hoş Geldin{user ? `, ${user.fullName}` : ""}
            </h1>
            <p className="text-2xl text-primary">{greeting}</p>
            <p className="text-lg text-muted-foreground">
              Cüzdanlarını yönet, kartlarını takip et ve finansal hedeflerine ulaş.
            </p>

            {/* Para birimi seçimi */}
            <div className="mb-6 flex items-center gap-4">
              <label htmlFor="currency-select" className="font-semibold">
                Toplam Bakiye Para Birimi:
              </label>
              <select
                id="currency-select"
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="border rounded px-3 py-1 dark:bg-zinc-700 dark:text-white"
              >
                {availableCurrencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </div>

            {wallets.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed p-6 text-center bg-white/60 dark:bg-zinc-800/40">
                <h2 className="text-xl font-semibold mb-2">Henüz hiç cüzdanın yok</h2>
                <p className="text-sm text-muted-foreground mb-4">Başlamak için bir cüzdan oluştur.</p>
                <button
                  onClick={() => router.push("/dashboard/wallets/add")}
                  className="px-4 py-2 text-white bg-black dark:bg-white dark:text-black rounded-md hover:scale-105 transition"
                >
                  Cüzdan Oluştur
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-xl transition duration-300 backdrop-blur-md bg-white/70 dark:bg-zinc-800/70">
                    <CardHeader>
                      <CardTitle>Cüzdan Sayısı</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-semibold">{wallets.length}</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-xl transition duration-300 backdrop-blur-md bg-white/70 dark:bg-zinc-800/70">
                    <CardHeader>
                      <CardTitle>Toplam Bakiye ({baseCurrency})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-semibold">
                        {totalBalance.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: baseCurrency,
                        })}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-xl transition duration-300 backdrop-blur-md bg-white/70 dark:bg-zinc-800/70">
                    <CardHeader>
                      <CardTitle>Harcama Limiti ({baseCurrency})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-1">
                        {spendingUsed.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: baseCurrency,
                        })}{" "}
                        /{" "}
                        {spendingLimit.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: baseCurrency,
                        })}
                      </p>
                      <Progress value={progressPercent} />
                    </CardContent>
                  </Card>
                </div>

                {/* Cüzdan Detayları */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wallets.map((wallet) => {
                    const convertedBalance = convertCurrency(
                      wallet.balance,
                      wallet.currency,
                      baseCurrency
                    );
                    return (
                      <Card
                        key={wallet.id}
                        className="backdrop-blur-md bg-white/80 dark:bg-zinc-800/80 hover:scale-105 transition-transform duration-200"
                      >
                        <CardHeader>
                          <CardTitle>{wallet.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-semibold">
                            {wallet.balance.toLocaleString("tr-TR", {
                              style: "currency",
                              currency: wallet.currency,
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ({convertedBalance.toLocaleString("tr-TR", {
                              style: "currency",
                              currency: baseCurrency,
                            })} {baseCurrency} karşılığı)
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Akıllı öneri kutusu */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 shadow-inner mt-6">
                  <p className="text-sm text-green-900 dark:text-green-100">
                    💡 İpucu: Döviz kurlarını takip ederek paranızı en iyi şekilde değerlendirin.
                  </p>
                </div>
              </>
            )}

            <QuickActions />
            <AnalyticsWidget />
          </section>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center text-lg font-medium hover:shadow-xl transition">
              🧾 Cüzdan ve Kartlarını Kolayca Yönet
            </Card>
            <Card className="p-6 text-center text-lg font-medium hover:shadow-xl transition">
              📈 Finansal Durumunu Anında Gör
            </Card>
            <Card className="p-6 text-center text-lg font-medium hover:shadow-xl transition">
              🧠 Akıllı Tavsiyelerle Harcamalarını Optimize Et
            </Card>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">


            <Card>
              <CardHeader>
                <CardTitle>Kişiselleştirilmiş Tavsiyeler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p><Lightbulb className="inline mr-2 text-yellow-500" /> Gıda harcamalarını %10 azaltmayı deneyebilirsin.</p>
                <p><Lightbulb className="inline mr-2 text-yellow-500" /> Hedefine ulaşmak için haftalık ₺400 kenara koy.</p>
                <p><Lightbulb className="inline mr-2 text-yellow-500" /> Bu ay ulaşım giderlerin ortalamanın üzerinde.</p>
              </CardContent>
            </Card>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>En Çok Harcama Yaptığın Kategoriler</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpensesPieChart data={expensesData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aylık Gelir/Gider Trendin</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyTrendLineChart data={mockMonthlyTrendData} />
              </CardContent>
            </Card>
          </section>


          <section className="flex flex-wrap justify-center gap-4">
            {user ? (
              <>
                <Button onClick={() => router.push("/dashboard")}>📂 Dashboard</Button>
                <Button variant="outline" onClick={logout}>🚪 Çıkış Yap</Button>
              </>
            ) : (
              <>
                <Button onClick={() => router.push("/register")}>🚀 Kayıt Ol</Button>
                <Button variant="outline" onClick={() => router.push("/login")}>🔐 Giriş Yap</Button>
              </>
            )}
          </section>



          <section className="text-center mt-8">
            <p className="italic text-muted-foreground text-sm">"{quote}"</p>
          </section>


        </main>
      </div>
    </ProtectedRoute>
  );
}
