"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet as WalletType } from "@/types/wallet";
import { getWalletsByUser } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Euro, Plus, Wallet as WalletIcon } from "lucide-react";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { useWalletStore } from "@/app/store/walletStore";
import { motion } from "framer-motion";

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
        useWalletStore.getState().setWallets(wallets); // store'a yaz
        setWallets(wallets); // local state'e yaz
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">💼 Cüzdanlarım</h1>
          {wallets.length > 0 && (
            <Button variant="outline" onClick={() => router.push("/dashboard/wallets/add")}>
              <Plus size={18} className="mr-2" />
              Yeni Cüzdan Ekle
            </Button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Yükleniyor...</p>
        ) : wallets.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-6 mt-12">
            <img src="/wallet.svg" alt="Empty Wallet" className="w-48 h-48 sm:w-64 sm:h-64" />
            <h2 className="text-2xl font-semibold">Henüz bir cüzdan eklemedin</h2>
            <p className="text-muted-foreground max-w-md">
              Bütçeni yönetmeye başlamak için ilk cüzdanını oluştur.
            </p>
            <Button size="lg" onClick={() => router.push("/dashboard/wallets/add")}>
              🚀 İlk Cüzdanını Oluştur
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => (
              <Card
                key={wallet.id}
                className="group hover:shadow-lg transition-all duration-300 border border-muted bg-muted/20 dark:bg-muted/30"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    {currencyIcon(wallet.currency)}
                    {wallet.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">{wallet.currency}</Badge>
                </CardHeader>

                <CardContent>
                  <div className="text-3xl font-bold">{wallet.balance.toLocaleString("tr-TR", { style: "currency", currency: wallet.currency })}</div>
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-6 gap-2">
                    <Button
                      variant="ghost"
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => router.push(`/dashboard/wallets/${wallet.id}/transfer`)}
                    >
                      Transfer Yap
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => router.push(`/dashboard/wallets/${wallet.id}/details`)}
                    >
                      Detayları Gör <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </ProtectedRoute>
  );
};

export default WalletsPage;
