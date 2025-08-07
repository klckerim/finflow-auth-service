"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { transferAmount, getLastTransfers } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Lottie from "react-lottie-player";
import successAnimation from "@/assets/lottie/success.json";
import loadingAnimation from "@/assets/lottie/loading.json";
import { useWalletStore } from "@/app/store/walletStore";
import { DialogTitle, Dialog, DialogContent } from "@/components/ui/dialog";
import { parseUnknownError } from "@/lib/api-error-handler";

export default function TransferPage() {
  const { id: walletId } = useParams();
  const router = useRouter();

  const [toWalletId, setToWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletOptions, setWalletOptions] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastTransfers, setLastTransfers] = useState<any[]>([]);

  const otherWallets = useWalletStore((state) => state.wallets);
  const currentWallet = otherWallets.find((w) => w.id === walletId);
  const selectedToWallet = otherWallets.find((w) => w.id === toWalletId);

  useEffect(() => {
    setWalletOptions(otherWallets.filter((w) => w.id !== walletId));
    // getLastTransfers(walletId as string).then(setLastTransfers);
  }, [walletId, otherWallets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);

    if (!toWalletId || !numericAmount) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (numericAmount <= 0) {
      toast.error("Amount must be a positive number.");
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

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        ⬅ Back
      </Button>

      <h1 className="text-2xl font-bold">💸 Money Transfer</h1>
      <p className="text-muted-foreground mb-4">
        Select recipient wallet and the amount you want to send.
      </p>

      <Card className="shadow-lg border-muted">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Transfer Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Current Wallet: <strong>{currentWallet?.name || `Wallet #${walletId}`}</strong></p>
            <p>Balance: <strong>{currentWallet?.balance?.toFixed(2)}</strong></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Wallet</label>
              <Select value={toWalletId} onValueChange={setToWalletId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose recipient wallet" />
                </SelectTrigger>
                <SelectContent>
                  {walletOptions.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name || `Wallet #${wallet.id}`} — {wallet.balance.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <div className="flex justify-center">
                  <Lottie animationData={loadingAnimation} loop style={{ width: 80, height: 80 }} />
                </div>
              ) : (
                "Transfer"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-lg">📜 Last 5 Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {lastTransfers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Transfer history is empty.</p>
          ) : (
            lastTransfers.slice(0, 5).map((tx, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm border-b pb-1 last:border-0"
              >
                <span className="font-medium">{tx.toWalletName || tx.toWalletId}</span>
                <span className="text-right">{tx.amount}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {showSuccess && (
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="text-center">
            <DialogTitle className="sr-only">Transfer Successful</DialogTitle>
            <Lottie animationData={successAnimation} loop={false} style={{ width: 100, height: 100 }} />
            <p className="text-lg font-semibold mt-4">Transfer Successful 🎉</p>
            <Button onClick={() => router.push("/dashboard/wallets")}>Ok</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
