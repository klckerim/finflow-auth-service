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
    className="p-6 pb-24 space-y-6 max-w-screen-md mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">

          <div className="space-y-8 px-4 py-6">
            {wallets.length === 0 ? (
              <div></div>
            ) : (
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">💼 Cüzdanlarım</h1>
                <Button variant="outline" onClick={() => router.push("/dashboard/wallets/add")}>
                  <Plus size={18} />
                  Yeni Cüzdan Ekle
                </Button>
              </div>
            )}
            
            {loading ? (
              <p>Yükleniyor...</p>
            ) : wallets.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <img src={"/wallet.svg"} alt="Empty Wallet" className="w-64 h-64 opacity-100" />
                <h2 className="text-2xl font-semibold">Henüz bir cüzdan eklemedin</h2>
                <p className="text-muted-foreground max-w-md">
                  Bütçeni yönetmeye başlamak için ilk cüzdanını oluştur.
                </p>
                <Button size="lg" onClick={() => router.push("/dashboard/wallets/add")}>
                  🚀 İlk Cüzdanını Oluştur
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {wallets.map((wallet) => (
                  <Card
                    key={wallet.id}
                    className="group hover:shadow-xl transition-all duration-300 border border-muted bg-muted/20 dark:bg-muted/30"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        {currencyIcon(wallet.currency)}
                        {wallet.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">{wallet.currency}</Badge>
                    </CardHeader>

                    <CardContent>
                      <div className="text-3xl font-bold">{wallet.balance.toLocaleString()}</div>
                      <div className="justify-between items-center mt-4">
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
          </div>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
};

export default WalletsPage;
