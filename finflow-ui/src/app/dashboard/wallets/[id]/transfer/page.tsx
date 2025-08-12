"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/cards/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import Lottie from "react-lottie-player";
import successAnimation from "@/shared/assets/lottie/success.json";
import loadingAnimation from "@/shared/assets/lottie/loading.json";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useWalletStore } from "@/app/store/walletStore";
import { transferAmount } from "@/shared/lib/api";
import { parseUnknownError } from "@/shared/lib/api-error-handler";

export default function TransferPage() {
  const { id: walletId } = useParams();
  const router = useRouter();

  const [toWalletId, setToWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [walletOptions, setWalletOptions] = useState<any[]>([]);
  const [lastTransfers, setLastTransfers] = useState<any[]>([]);

  const wallets = useWalletStore((state) => state.wallets);
  const currentWallet = wallets.find((w) => w.id === walletId);

  useEffect(() => {
    setWalletOptions(wallets.filter((w) => w.id !== walletId));
    // Buraya son transferleri getirecek API bağlanabilir
  }, [walletId, wallets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    if (!toWalletId || !numericAmount) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (numericAmount <= 0) {
      toast.error("Amount must be positive.");
      return;
    }
    if (numericAmount > (currentWallet?.balance ?? 0)) {
      toast.error("Insufficient balance ❌");
      return;
    }

    setLoading(true);
    try {
      await transferAmount(walletId as string, {
        fromWalletId: walletId as string,
        toWalletId,
        amount: numericAmount,
      });

      setShowSuccess(true);
      setAmount("");
      setToWalletId("");
    } catch (ex) {
      parseUnknownError(ex);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [50, 100, 250, 500];

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="text-sm">
        ⬅ Back to Wallet
      </Button>

      {/* Cüzdan Özeti */}
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            💼 {currentWallet?.name || "Current Wallet"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className="text-2xl font-bold">
            {currentWallet?.balance?.toFixed(2)} {currentWallet?.currency || ""}
          </p>
        </CardContent>
      </Card>

      {/* Transfer Form */}
      <Card className="shadow-lg border">
        <CardHeader>
          <CardTitle className="text-lg">💸 Send Money</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Recipient */}
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Wallet</label>
              <Select value={toWalletId} onValueChange={setToWalletId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose recipient wallet" />
                </SelectTrigger>
                <SelectContent>
                  {walletOptions.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name} — {wallet.balance.toFixed(2)} {wallet.currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <Input
                type="number"
                placeholder="e.g. 150.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {/* Quick Amount Buttons */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {quickAmounts.map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setAmount(amt.toString())}
                  >
                    {amt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Lottie animationData={loadingAnimation} loop style={{ width: 40, height: 40 }} />
              ) : (
                "Send Money"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Last Transfers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📜 Last Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          {lastTransfers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent transfers.</p>
          ) : (
            lastTransfers.map((tx, idx) => (
              <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0">
                <span>{tx.toWalletName}</span>
                <span>{tx.amount}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Success Dialog */}
      {showSuccess && (
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="text-center">
            <DialogTitle className="sr-only">Transfer Successful</DialogTitle>
            <Lottie animationData={successAnimation} loop={false} style={{ width: 100, height: 100 }} />
            <p className="text-lg font-semibold mt-4">Transfer Successful 🎉</p>
            <Button onClick={() => router.push("/dashboard/wallets")}>OK</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
