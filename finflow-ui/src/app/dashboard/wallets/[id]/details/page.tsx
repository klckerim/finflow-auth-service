"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Wallet } from "@/shared/types/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/cards/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/layout/skeleton";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  LucideTimer,
  Copy,
  Send,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { getWalletById, deleteWalletById, getTransactionsByWalletId } from "@/shared/lib/api";
import { parseUnknownError } from "@/shared/lib/api-error-handler";
import { motion } from "framer-motion";

const WalletDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastTransfers, setLastTransfers] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    getWalletById(id as string)
      .then((data) => setWallet(data))
      .catch(() => {
        toast.error("Wallet information could not be retrieved.");
        router.push("/dashboard/wallets");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        if (!wallet) return;
        const response = await getTransactionsByWalletId(wallet?.id, 5);
        setLastTransfers(response);
      } catch (err) {
        parseUnknownError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [wallet]);


  const handleCopyId = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.id);
    setCopied(true);
    toast.success("Wallet ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!wallet?.id) return;

    const confirm = window.confirm(
      `Are you sure you want to delete the wallet "${wallet.name}"? This action is irreversible!`
    );
    if (!confirm) return;

    try {
      setIsDeleting(true);
      await deleteWalletById(wallet.id);
      toast.success("Wallet deleted successfully 🗑️");
      router.push("/dashboard/wallets");
    } catch (error) {
      parseUnknownError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-2/5 rounded-md" />
        <Skeleton className="h-8 w-1/3 rounded-md" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    );
  }

  if (!wallet) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* NAVIGATION BUTTONS */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => router.push(`/dashboard/wallets/${wallet.id}/edit`)}
            className="gap-2"
            aria-label="Edit wallet"
          >
            <Edit3 className="w-5 h-5" /> Edit
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2"
            aria-label="Delete wallet"
          >

            {isDeleting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "linear" }}
              >
                <Trash2 className="w-5 h-5" />
              </motion.div>
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* WALLET OVERVIEW */}
      <Card className="bg-muted/40 border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl font-extrabold">
            💼 {wallet.name}
            <Badge variant="outline" className="text-sm">
              {wallet.currency}
            </Badge>
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Detailed wallet info and quick actions for your financial management.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-foreground">
          <div className="text-5xl font-extrabold">
            {wallet.balance.toLocaleString(undefined, {
              style: "currency",
              currency: wallet.currency,
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <LucideTimer className="w-5 h-5" />
              <span>Created: {new Date(wallet.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono truncate max-w-[12rem]">
                ID: {wallet.id}
              </span>
              <Copy
                className={`w-5 h-5 cursor-pointer transition-colors ${copied ? "text-green-500" : "text-blue-500 hover:text-blue-700"
                  }`}
                onClick={handleCopyId}
                // title="Copy Wallet ID"
                aria-label="Copy Wallet ID"
              />
              {copied && (
                <CheckCircle2 className="w-5 h-5 text-green-500 animate-pulse" />
              )}
            </div>
            <div>
              State:{" "}
              <Badge variant={wallet.isActive ? "default" : "destructive"}>
                {wallet.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QUICK ACTIONS */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Quick Actions</CardTitle>
          <CardDescription>
            Need to move money fast? Use these shortcuts to manage your wallet.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-4">
          <Button
            variant="default"
            className="flex items-center gap-2 flex-grow sm:flex-grow-0"
            onClick={() => router.push(`/dashboard/wallets/${wallet.id}/transfer`)}
            aria-label="Send money"
          >
            <Send className="w-5 h-5" /> Send Money
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 flex-grow sm:flex-grow-0"
            onClick={() => router.push(`/dashboard/wallets/${wallet.id}/edit`)}
            aria-label="Edit wallet"
          >
            <Edit3 className="w-5 h-5" /> Edit Wallet
          </Button>
        </CardContent>
      </Card>

      {/* STATISTICS */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Statistics</CardTitle>
          <CardDescription>Summary of your wallet transactions</CardDescription>
        </CardHeader>

      </Card>

      {/* LAST TRANSFERS */}
      <Card>
        <CardHeader>
          <CardTitle>🕒 Last Transfers</CardTitle>
          <CardDescription>
            Review your recent wallet transfers for quick reference.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-muted-foreground">
          
          {lastTransfers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transfers yet.</p>
          ) : (
            lastTransfers.map((tx, idx) => (
              <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0">
                <span>{tx.description}</span>
                <span>{tx.amount} {wallet.currency || ""}</span>
              </div>
            ))
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default WalletDetailPage;
