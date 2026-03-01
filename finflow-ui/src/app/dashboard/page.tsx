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

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

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
  const recentTransactions = transactions.slice(0, 5);

  if (isLoading || !user || walletsLoading || cardsLoading || ratesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-3xl space-y-4 text-center">
          <Skeleton className="mx-auto h-10 w-48" />
          <Skeleton className="mx-auto h-5 w-72" />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <main className="mx-auto w-full max-w-screen-2xl space-y-8">
          <motion.header
            className="ff-surface flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold md:text-3xl">{greeting}, {user.fullName} 👋</h1>
              <p className="text-sm text-muted-foreground md:text-base">{t("common.str_WelcomeToPortal")}</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                {availableCurrencies.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                <LogOut className="h-4 w-4" />
                {t("dashboard.logout")}
              </Button>
            </div>
          </motion.header>

          <motion.section
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-400/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.totalBalance")}</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {totalBalance.toLocaleString("en-US", { style: "currency", currency: baseCurrency })}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{t("common.str_AmountIn", { currency: baseCurrency })}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/10 to-green-400/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.numberOfWallets")}</CardTitle>
                <WalletIcon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{wallets.length}</div>
                <p className="mt-1 text-xs text-muted-foreground">{t("common.str_ManagedAccounts")}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-amber-400/10 md:col-span-2 xl:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t("dashboard.expenseLimit")}</CardTitle>
                <Target className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">
                  {spendingUsed.toLocaleString("en-US", { style: "currency", currency: baseCurrency })}
                </div>
                <Progress value={progressPercent} />
                <p className="mt-1 text-xs text-muted-foreground">
                  {progressPercent.toFixed(0)}% / {spendingLimit.toLocaleString("en-US", {
                    style: "currency", currency: baseCurrency
                  })}
                </p>
              </CardContent>
            </Card>
          </motion.section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-8">
              <motion.section
                className="ff-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <WalletIcon className="h-5 w-5" /> {t("common.str_MyWallets")}
                  </h2>
                  <Button size="sm" onClick={() => router.push("/dashboard/wallets/add")} className="gap-1">
                    <Plus className="h-4 w-4" /> {t("dashboard.addWallet")}
                  </Button>
                </div>

                {wallets.length === 0 ? (
                  <Card className="border-dashed py-8 text-center">
                    <CardContent>
                      <WalletIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 font-semibold">{t("common.str_NoWallets")}</h3>
                      <p className="mb-4 text-muted-foreground">{t("common.str_CreateFirstWallet")}</p>
                      <Button onClick={() => router.push("/dashboard/wallets/add")}>{t("dashboard.createWallet")}</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {wallets.slice(0, 4).map((wallet) => {
                      const converted = convertCurrency(wallet.balance, wallet.currency, baseCurrency);
                      return (
                        <Card key={wallet.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-sm">{wallet.name}</CardTitle>
                              <Badge variant="outline" className="text-xs">{wallet.currency}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xl font-semibold">
                              {wallet.balance.toLocaleString("en-US", {
                                style: "currency", currency: wallet.currency
                              })}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              ≈ {converted.toLocaleString("en-US", {
                                style: "currency", currency: baseCurrency
                              })}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {wallets.length > 4 && (
                      <Card className="flex items-center justify-center">
                        <CardContent className="py-6 text-center">
                          <p className="mb-2 text-sm text-muted-foreground">
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

              <motion.section
                className="ff-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <CreditCard className="h-5 w-5" /> {t("card.myCards")}
                  </h2>
                  <Button size="sm" onClick={() => router.push("/dashboard/cards/new")} className="gap-1">
                    <Plus className="h-4 w-4" /> {t("card.addNewCard")}
                  </Button>
                </div>

                {userCards.length === 0 ? (
                  <Card className="border-dashed py-8 text-center">
                    <CardContent>
                      <CreditCard className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 font-semibold">{t("card.noCards")}</h3>
                      <p className="mb-4 text-muted-foreground">{t("card.addFirstCard")}</p>
                      <Button onClick={() => router.push("/dashboard/cards/new")}>{t("card.addCard")}</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {userCards.slice(0, 2).map((card) => (
                      <Card key={card.id} className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm text-white">{card.brand}</CardTitle>
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {card.currency}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-lg font-semibold tracking-widest">**** **** **** {card.last4}</p>
                          <div className="flex justify-between text-sm">
                            <span>{card.cardHolderName}</span>
                            <span>{`${card.expMonth}/${card.expYear}`}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {userCards.length > 2 && (
                      <Card className="flex items-center justify-center md:col-span-2">
                        <CardContent className="py-6 text-center">
                          <p className="mb-2 text-sm text-muted-foreground">
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

              <motion.section
                className="ff-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <QuickActions />
              </motion.section>
            </div>

            <div className="space-y-6 xl:col-span-4">
              <div className="grid grid-cols-1 gap-6">
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <PieChart className="h-4 w-4" /> {t("common.str_Statistics")}
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

              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>{t("common.str_LastTransactions")}</span>
                      <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/transactions")}>
                        {t("common.str_ViewAll")} <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4">
                    {transactionsLoading ? (
                      <Skeleton className="h-20 w-full rounded-lg" />
                    ) : recentTransactions.length === 0 ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">{t("common.str_NoTransaction")}</p>
                    ) : (
                      recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between border-b border-border/70 py-3 last:border-0">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className={`whitespace-nowrap text-sm font-medium ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                            {transaction.amount > 0 ? "+" : ""}
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
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
