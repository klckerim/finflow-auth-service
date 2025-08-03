"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AnalyticsWidget from "@/components/AnalyticsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { getGreeting } from "@/components/ui/label";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import QuickActions from "@/components/quickactions";


export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  const greeting = getGreeting();

  if (isLoading || !user) {
    // İsteğe bağlı: yüklenme animasyonu
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold">👋 FinFlow’a Hoş Geldin, {user.name || user.email || "Kullanıcı"}</h1>
        <h1 className="text-3xl font-bold">{greeting}, {user.name || user.email || "Kullanıcı"} 👋</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktif Başvurular</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Puanın</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1245</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cüzdan Sayısı</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2</p>
            </CardContent>
          </Card>
        </div>

        <QuickActions />
        <AnalyticsWidget />
      </div>
    </ProtectedRoute>
  );
}
