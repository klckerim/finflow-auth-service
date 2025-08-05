"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet as WalletType } from "@/types/wallet";
import { getWalletsByUser } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Euro, Wallet as WalletIcon } from "lucide-react";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { useWalletStore } from "@/app/store/walletStore";

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
      <div className="space-y-8 px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">💼 Cüzdanlarım</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard/wallets/add")}>
            Yeni Cüzdan Ekle
          </Button>
        </div>

        {loading ? (
          <p>Yükleniyor...</p>
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
                  <div className="text-3xl font-bold">₺{wallet.balance.toLocaleString()}</div>
                  <div className="flex justify-between items-center mt-4">
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
    </ProtectedRoute>
  );
};

export default WalletsPage;
