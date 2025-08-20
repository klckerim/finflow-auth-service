"use client";
import { Skeleton } from "@/components/layout/skeleton";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { getTransactionsByUserId } from "@/shared/lib/api";
import { parseUnknownError } from "@/shared/lib/api-error-handler";
import router from "next/router";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const { user, isLoading } = useAuth();
  const [transactionsLoading, setTransactionsLoading] = useState(true);

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
        <h1 className="text-2xl font-bold mb-6">💸 Transactions</h1>

        {/* Desktop table (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto w-full rounded-lg border shadow-sm">
          <table className="w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t.type}</td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${t.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                    {t.amount.toLocaleString(undefined, { style: "currency", currency: t.currency })}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{t.description}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-3">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md">{t.type}</span>
                <span className={`text-sm font-semibold ${t.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                  {t.amount.toLocaleString(undefined, { style: "currency", currency: t.currency })}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2 line-clamp-2">{t.description}</div>
              <div className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions yet</h3>
            <p className="text-gray-500">Your transactions will appear here once you make your first transaction.</p>
          </div>
        )}
    </ProtectedRoute>
  );
}