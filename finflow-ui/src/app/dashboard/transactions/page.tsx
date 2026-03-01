"use client";
import { Skeleton } from "@/components/layout/skeleton";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { getTransactionsByUserId } from "@/shared/lib/api";
import { parseUnknownError } from "@/shared/lib/api-error-handler";
import router from "next/router";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const { user, isLoading } = useAuth();
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const { t: tr } = useLocale();

  // Auth kontrolü
  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  // Transactionları çek
  useEffect(() => {
    if (user) {
      (async () => {
        try {
          setTransactionsLoading(true);
          const response = await getTransactionsByUserId(user.userId, 50);
          setTransactions(response);
        } catch (err) {
          parseUnknownError(err);
        } finally {
          setTransactionsLoading(false);
        }
      })();
    }
  }, [user]);

  if (isLoading || !user || transactionsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Skeleton className="h-12 w-1/2" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <h1 className="mb-6 text-2xl font-semibold text-foreground">💸 {tr("common.str_Transactions")}</h1>

      {/* Desktop Table */}
      <div className="ff-table hidden w-full overflow-x-auto md:block">
        <table className="w-full">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {tr("common.type")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {tr("common.amount")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {tr("common.description")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {tr("common.date")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {tr(t.type)}
                </td>
                <td
                  className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${t.amount < 0 ? "text-red-500" : "text-green-500"
                    }`}
                >
                  {t.amount.toLocaleString(undefined, {
                    style: "currency",
                    currency: t.currency,
                  })}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground max-w-xs truncate">
                  {t.description}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(t.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="space-y-3 md:hidden">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="ff-surface rounded-xl p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="rounded-md bg-muted/70 px-2 py-1 text-sm font-medium">
                {tr(t.type)}
              </span>
              <span
                className={`text-sm font-semibold ${t.amount < 0 ? "text-red-500" : "text-green-500"
                  }`}
              >
                {t.amount.toLocaleString(undefined, {
                  style: "currency",
                  currency: t.currency,
                })}
              </span>
            </div>
            <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {t.description}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(t.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            {tr("common.str_NoTransaction")}
          </h3>
          <p className="text-muted-foreground">
            {tr("common.str_NoTransactionExplanation")}
          </p>
        </div>
      )}
    </ProtectedRoute>
  );
}