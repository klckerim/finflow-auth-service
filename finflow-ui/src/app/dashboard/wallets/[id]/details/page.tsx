"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Wallet } from "@/types/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit3, TrendingUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Wallet as WalletType } from "@/types/wallet";

  
async function getWalletById(id: string): Promise<WalletType | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/wallets/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    return null;
  }
}


const WalletDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getWalletById(id as string)
      .then((data) => setWallet(data))
      .catch(() => {
        toast.error("No Wallet Information");
        router.push("/dashboard/wallets");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!wallet) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Geri
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2" onClick={() => router.push(`/dashboard/wallets/${wallet.id}/edit`)}>
            <Edit3 className="w-4 h-4" /> Düzenle
          </Button>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="w-4 h-4" /> Sil
          </Button>
        </div>
      </div>

      <Card className="shadow-md bg-muted/30 border border-border">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            💼 {wallet.name}
            <Badge variant="outline" className="text-xs">
              {wallet.currency}
            </Badge>
          </CardTitle>
          <CardDescription>Cüzdanın detaylı bilgileri aşağıda listelenmiştir.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div className="text-4xl font-bold text-foreground">
            Bakiye: ₺{wallet.balance.toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Oluşturulma Tarihi: {new Date(wallet.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="text-sm">Cüzdan ID: <span className="font-mono text-xs">{wallet.id}</span></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletDetailPage;
