"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet as WalletType } from "@/shared/types/wallet";
import { getWalletsByUser } from "@/shared/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/features/cards/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  DollarSign,
  Euro,
  Plus,
  SendHorizontal,
  Wallet as WalletIcon,
  Clock,
  CreditCard
} from "lucide-react";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { useWalletStore } from "@/app/store/walletStore";
import { motion } from "framer-motion";
import { EmptyWalletHero } from "@/components/ui/hero";

const WalletsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchWallets = async () => {
      try {
        const wallets = await getWalletsByUser(user.userId);
        useWalletStore.getState().setWallets(wallets);
        setWallets(wallets);
      } catch (error) {
        console.error("Wallets fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [user]);

  const currencyIcon = (currency: string) => {
    switch (currency) {
      case "USD":
        return <DollarSign className="text-green-600" />;
      case "EUR":
        return <Euro className="text-blue-600" />;
      default:
        return <WalletIcon className="text-primary" />;
    }
  };

  return (
    <ProtectedRoute>
      <motion.div
        className="px-4 md:px-8 pt-6 pb-32 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">💼 My Wallets</h1>
          {wallets.length > 0 && (
            <Button
              className="shadow-md hover:shadow-lg transition-all"
              onClick={() => router.push("/dashboard/wallets/add")}
            >
              <Plus size={18} className="mr-2" />
              Add New Wallet
            </Button>
          )}
        </div>

        {/* Loading & Empty State */}
        {loading ? (
          <p className="text-center text-muted-foreground">Loading wallets...</p>
        ) : wallets.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-6 mt-12">
            <EmptyWalletHero />
            <Button
              size="lg"
              className="shadow-lg hover:shadow-xl transition"
              onClick={() => router.push("/dashboard/wallets/add")}
            >
              🚀 Create Your First Wallet
            </Button>
          </div>
        ) : (
          // Wallet Grid
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => {
              return (
                <motion.div
                  key={wallet.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="group overflow-hidden relative border border-muted bg-gradient-to-br from-muted/30 to-card/90 backdrop-blur rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        {currencyIcon(wallet.currency)}
                        {wallet.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {wallet.currency}
                      </Badge>
                    </CardHeader>

                    <CardContent>
                      <div className="text-3xl font-bold">
                        {wallet.balance.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: wallet.currency,
                        })}
                      </div>

                      {/* Extra info */}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Last activity: {new Date().toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CreditCard className="w-4 h-4" />
                        {"Virtual Card"}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-6 gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sm text-muted-foreground hover:text-primary"
                          onClick={() => router.push(`/dashboard/wallets/${wallet.id}/transfer`)}
                        >
                          Transfer <SendHorizontal className="ml-1 w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sm text-muted-foreground hover:text-primary"
                          onClick={() => router.push(`/dashboard/wallets/${wallet.id}/details`)}
                        >
                          See Details <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </ProtectedRoute>
  );
};

export default WalletsPage;
