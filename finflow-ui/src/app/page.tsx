"use client"

/**
 * Dashboard main page - Protected route.
 * Shows welcome message, user metrics cards, quick actions, and analytics placeholder.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProtectedRoute from "@/components/utils/ProtectedRoute";
import QuickActions from "@/components/quickactions";
import { useAuth } from "@/context/auth-context";
import AnalyticsWidget from "@/components/AnalyticsWidget";
import { getGreeting } from "@/components/ui/label";

const Dashboard = () => {
  // const { user } = useAuth();
  const { user, isLoading } = useAuth();
  const greeting = getGreeting();

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">👋 FinFlow’a Hoş Geldin, {user?.name || user?.email || "Kullanıcı"}</h1>
        <h1 className="text-3xl font-bold">
          {greeting}, {user?.name || user?.email || "Kullanıcı"} 👋
        </h1>
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
              <CardTitle>Cüzdan Sayısı test </CardTitle>
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
};

export default Dashboard;


