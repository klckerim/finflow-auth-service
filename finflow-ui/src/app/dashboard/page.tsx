// app/dashboard/page.tsx
"use client"

import AnalyticsWidget from "@/components/AnalyticsWidget";
import QuickActions from "@/components/quickactions";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import { useUser } from "@/hooks/useUser";

import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 pt-20 space-y-6">
          <Skeleton className="h-8 w-[300px]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-48" />
        </main>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 pt-20 overflow-y-auto">
          <section className="space-y-6">
            <h1 className="text-2xl font-bold">👋 Hoş geldin, {user.email}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aktif Başvurular</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">2</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Puanın</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">780</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cüzdan Sayısı</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">5</p>
                </CardContent>
              </Card>
            </div>

            <QuickActions />
            <AnalyticsWidget />

            <Card className="mt-6">
              <CardContent className="p-6 space-y-2 text-sm">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.role || "Kullanıcı"}</p>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

