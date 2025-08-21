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
import { CreatePaymentSession } from "@/shared/lib/create-session";
import AddMoneyModal from "@/features/payments/topupmodal";
import Statistics from "@/components/ui/statistic";

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
        const response = await getTransactionsByWalletId(wallet?.id, 10);
        setLastTransfers(response);
      } catch (err) {
        parseUnknownError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [wallet]);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

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
      <div className="p-4 space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-2/5 rounded-md" />
        <Skeleton className="h-6 w-1/3 rounded-md" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (!wallet) return null;

  return (
    <motion.div
      className="px-3 sm:px-4 md:px-6 pt-4 pb-24 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* NAVIGATION BUTTONS */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-1 px-2 py-1 text-xs sm:text-sm"
          aria-label="Go back"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Back</span>
        </Button>

        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push(`/dashboard/wallets/${wallet.id}/edit`)}
            className="gap-1 px-2 py-1 text-xs sm:text-sm"
            aria-label="Edit wallet"
          >
            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Edit</span>
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-1 px-2 py-1 text-xs sm:text-sm"
            aria-label="Delete wallet"
          >
            {isDeleting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "linear" }}
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.div>
            ) : (
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span className="hidden xs:inline">Delete</span>
          </Button>
        </div>
      </div>

      {/* WALLET OVERVIEW */}
      <Card className="bg-muted/40 border border-border shadow-sm mb-4">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold">
            <span className="flex items-center gap-2">
              💼 {wallet.name}
            </span>
            <Badge variant="outline" className="text-xs w-fit mt-2 sm:mt-0">
              {wallet.currency}
            </Badge>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">
            Detailed wallet info and quick actions
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0 space-y-4 text-foreground">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {wallet.balance.toLocaleString(undefined, {
              style: "currency",
              currency: wallet.currency,
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <LucideTimer className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Created: {new Date(wallet.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono truncate max-w-[8rem] xs:max-w-[10rem] sm:max-w-[12rem]">
                ID: {wallet.id.slice(0, 8)}...
              </span>
              <Copy
                className={`w-3 h-3 sm:w-4 sm:h-4 cursor-pointer transition-colors ${copied ? "text-green-500" : "text-blue-500 hover:text-blue-700"
                  }`}
                onClick={handleCopyId}
                aria-label="Copy Wallet ID"
              />
              {copied && (
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 animate-pulse" />
              )}
            </div>
            <div className="sm:col-span-2">
              State:{" "}
              <Badge variant={wallet.isActive ? "default" : "destructive"} className="text-xs">
                {wallet.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QUICK ACTIONS */}
      <Card className="mb-4">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">⚡ Quick Actions</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Need to move money fast? Use these shortcuts.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0 flex flex-col xs:flex-row gap-2">
          <Button
            variant="default"
            className="flex items-center gap-1 flex-1 text-xs sm:text-sm py-2"
            onClick={() => router.push(`/dashboard/wallets/${wallet.id}/transfer`)}
            aria-label="Send money"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" /> Send
          </Button>

          <AddMoneyModal
            walletId={wallet.id}
            currency={wallet.currency || "USD"}
            onTopUp={(walletId: string, amount: number) => CreatePaymentSession(walletId, amount, wallet.currency || "USD")}
          />

          <Button
            variant="outline"
            className="flex items-center gap-1 flex-1 text-xs sm:text-sm py-2"
            onClick={() => router.push(`/dashboard/wallets/${wallet.id}/edit`)}
            aria-label="Edit wallet"
          >
            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" /> Edit
          </Button>
        </CardContent>
      </Card>

      {/* STATISTICS */}
      <Card className="mb-4">
        <CardContent className="p-3 sm:p-4">
          <Statistics transactions={lastTransfers} currency={wallet.currency == "" ? "USD" : wallet.currency} statisticType={"Wallet"} />
        </CardContent>
      </Card>

      {/* LAST TRANSFERS */}
      <Card className="bg-muted/10 dark:bg-muted/20 border dark:border-border shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-foreground dark:text-foreground">🕒 Last Transfers</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground">
            Review your recent wallet transfers
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0">
          {lastTransfers.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground">
              No transfers yet.
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto w-full rounded-lg border shadow-sm dark:border-border">
                <table className="w-full text-sm text-foreground dark:text-foreground">
                  <thead className="bg-gray-50 dark:bg-zinc-700">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                    {lastTransfers.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                        <td className="px-3 py-2 truncate max-w-[200px]">{tx.description}</td>
                        <td className="px-3 py-2">{tx.type}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{formatDate(tx.createdAt)}</td>
                        <td className="px-3 py-2 font-medium text-right whitespace-nowrap">
                          {tx.amount} {wallet?.currency || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-2">
                {lastTransfers.map((tx, idx) => (
                  <div key={idx} className="p-3 rounded-lg border shadow-sm bg-white dark:bg-zinc-800 dark:border-border">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-md">{tx.type}</span>
                      <span className="text-xs font-semibold">
                        {tx.amount} {wallet?.currency || ""}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{tx.description}</div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-400">{formatDate(tx.createdAt)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalletDetailPage;
