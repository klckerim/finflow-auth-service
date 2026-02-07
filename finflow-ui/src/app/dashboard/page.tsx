"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/features/cards/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/layout/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import QuickActions from "@/features/dashboard/quickactions";
import AnalyticsWidget from "@/features/dashboard/AnalyticsWidget";

import { useAuth } from "@/context/auth-context";
import { getTransactionsByUserId, getWalletsByUser, getCardsByUserId } from "@/shared/lib/api";
import { getGreeting } from "@/components/ui/label";
import currencyData from "@/shared/data/currency/currency.json";

import { Wallet } from "@/shared/types/wallet";
import { Card as CardType } from "@/shared/types/card";
import { parseUnknownError } from "@/shared/lib/api-error-handler";
import Statistics from "@/components/ui/statistic";
import { useLocale } from "@/context/locale-context";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Wallet as WalletIcon,
  CreditCard,
  Target,
  PieChart,
  Plus,
  LogOut,
  ArrowRight
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { t } = useLocale();

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletsLoading, setWalletsLoading] = useState(true);

  const [userCards, setUserCards] = useState<CardType[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [ratesLoading, setRatesLoading] = useState(true);

  const [baseCurrency, setBaseCurrency] = useState("EUR");

  const greeting = getGreeting();

  // Auth kontrolü
  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

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

  // Kartları çek
  useEffect(() => {
    if (user) {
      (async () => {
        try {
          setCardsLoading(true);
          const response = await getCardsByUserId(user.userId);
          setUserCards(response);
        } catch (err) {
          parseUnknownError(err);
        } finally {
          setCardsLoading(false);
        }
      })();
    }
  }, [user]);

  // İşlemleri çek
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

  // Kur verisi
  useEffect(() => {
    try {
      setRatesLoading(true);
      if (currencyData?.rates) setExchangeRates(currencyData.rates);
    } catch (err) {
      console.error(t("warningsMessages.ratesFetchFailed"), err);
    } finally {
      setRatesLoading(false);
    }
  }, [baseCurrency, t]);

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

  // Son işlemler
  const recentTransactions = transactions.slice(0, 5);

  if (isLoading || !user || walletsLoading || cardsLoading || ratesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-6 w-64 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {/* HEADER */}
          <motion.header
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary bg-clip-text">
                {greeting}, {user.fullName} 👋
              </h1>
              <p className="text-muted-foreground">{t("common.str_WelcomeToPortal")}</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="border border-muted rounded-lg px-3 py-2 bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {availableCurrencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                <LogOut className="w-4 h-4" />
                {t("dashboard.logout")}
              </Button>
            </div>
          </motion.header>

          {/* TOP METRİKLER */}
          <motion.section
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 rounded-3xl bg-background/80 p-4 md:p-6 shadow-sm border border-muted/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.totalBalance")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalBalance.toLocaleString("en-US", { style: "currency", currency: baseCurrency })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t("common.str_AmountIn", { currency: baseCurrency })}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.numberOfWallets")}</CardTitle>
                <WalletIcon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wallets.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{t("common.str_ManagedAccounts")}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.expenseLimit")}</CardTitle>
                <Target className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {spendingUsed.toLocaleString("en-US", { style: "currency", currency: baseCurrency })}
                </div>
                <Progress value={progressPercent} />
                <p className="text-xs text-muted-foreground mt-1">
                  {progressPercent.toFixed(0)}% / {spendingLimit.toLocaleString("en-US", {
                    style: "currency", currency: baseCurrency
                  })}
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* ANA İÇERİK ALANI - YENİ LAYOUT */}
          <div className="grid grid-cols-1 xl:grid-cols-7 gap-8">
            {/* SOL SÜTUN - Cüzdanlar ve Kartlar */}
            <div className="xl:col-span-4 space-y-6">
              {/* CÜZDANLAR */}
              <motion.section
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <WalletIcon className="w-5 h-5" /> {t("common.str_MyWallets")}
                  </h2>
                  <Button size="sm" onClick={() => router.push("/dashboard/wallets/add")} className="gap-1">
                    <Plus className="w-4 h-4" /> {t("dashboard.addWallet")}
                  </Button>
                </div>

                {wallets.length === 0 ? (
                  <Card className="text-center py-8 border-dashed">
                    <CardContent>
                      <WalletIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">{t("common.str_NoWallets")}</h3>
                      <p className="text-muted-foreground mb-4">{t("common.str_CreateFirstWallet")}</p>
                      <Button onClick={() => router.push("/dashboard/wallets/add")}>
                        {t("dashboard.createWallet")}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wallets.slice(0, 4).map((wallet) => {
                      const converted = convertCurrency(wallet.balance, wallet.currency, baseCurrency);
                      return (
                        <Card key={wallet.id} className="group hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-sm">{wallet.name}</CardTitle>
                              <Badge variant="outline" className="text-xs">{wallet.currency}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xl font-bold">
                              {wallet.balance.toLocaleString("en-US", {
                                style: "currency", currency: wallet.currency
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              ≈ {converted.toLocaleString("en-US", {
                                style: "currency", currency: baseCurrency
                              })}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {wallets.length > 4 && (
                      <Card className="flex items-center justify-center group hover:shadow-md transition-shadow">
                        <CardContent className="text-center py-6">
                          <p className="text-sm text-muted-foreground mb-2">
                            +{wallets.length - 4} {t("common.str_MoreWallets")}
                          </p>
                          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/wallets")}>
                            {t("common.str_ViewAll")}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </motion.section>

              {/* KARTLAR */}
              <motion.section
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> {t("card.myCards")}
                  </h2>
                  <Button size="sm" onClick={() => router.push("/dashboard/cards/new")} className="gap-1">
                    <Plus className="w-4 h-4" /> {t("card.addNewCard")}
                  </Button>
                </div>

                {userCards.length === 0 ? (
                  <Card className="text-center py-8 border-dashed">
                    <CardContent>
                      <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">{t("card.noCards")}</h3>
                      <p className="text-muted-foreground mb-4">{t("card.addFirstCard")}</p>
                      <Button onClick={() => router.push("/dashboard/cards/new")}>
                        {t("card.addCard")}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userCards.slice(0, 2).map((card) => (
                      <Card key={card.id} className="group hover:shadow-md transition-shadow bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-sm">{card.brand}</CardTitle>
                            <Badge variant="secondary" className="text-xs bg-white/20">
                              {card.currency}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-lg font-bold tracking-widest mb-2">
                            **** **** **** {card.last4}
                          </p>
                          <div className="flex justify-between text-sm">
                            <span>{card.cardHolderName}</span>
                            <span>{`${card.expMonth}/${card.expYear}`}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {userCards.length > 2 && (
                      <Card className="flex items-center justify-center group hover:shadow-md transition-shadow col-span-2">
                        <CardContent className="text-center py-6">
                          <p className="text-sm text-muted-foreground mb-2">
                            +{userCards.length - 2} {t("card.moreCards")}
                          </p>
                          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/cards")}>
                            {t("common.str_ViewAll")}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </motion.section>

              {/* HIZLI İŞLEMLER */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <QuickActions />
              </motion.section>
            </div>

            {/* SAĞ SÜTUN - İstatistikler, Analytics ve İşlemler */}
            <div className="xl:col-span-3 space-y-6">
              {/* İSTATİSTİKLER VE ANALYTICS - YAN YANA */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <PieChart className="w-4 h-4" /> {t("common.str_Statistics")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Statistics
                        transactions={transactions}
                        currency={baseCurrency}
                        statisticType="User"
                      />
                    </CardContent>
                  </Card>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <AnalyticsWidget />
                </motion.section>
              </div>

              {/* SON İŞLEMLER - TAM GENİŞLİK */}
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-base">{t("common.str_LastTransactions")}</span>
                      <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/transactions")}>
                        {t("common.str_ViewAll")} <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {recentTransactions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">{t("common.str_NoTransaction")}</p>
                    ) : (
                      recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className={`text-sm font-medium whitespace-nowrap ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                            {transaction.amount > 0 ? '+' : ''}
                            {transaction.amount.toLocaleString("en-US", {
                              style: "currency", currency: transaction.currency
                            })}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.section>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
