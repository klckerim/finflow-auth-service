"use client";
import { Skeleton } from "@/components/layout/skeleton";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { getTransactionsByUserId } from "@/shared/lib/api";
import { parseUnknownError } from "@/shared/lib/api-error-handler";
import { useParams } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
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
          const response = await getTransactionsByUserId(user.userId, 10);
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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t: any) => (
              <tr key={t.id} className="border-b">
                <td className="px-4 py-2">{t.type}</td>
                <td className={`px-4 py-2 ${t.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                  {t.amount}
                </td>
                <td className="px-4 py-2">{t.description}</td>
                <td className="px-4 py-2">
                  {new Date(t.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}
