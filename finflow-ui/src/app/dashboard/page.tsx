"use client"

import ActionButton from "@/components/actionbutton";
import DashboardCard from "@/components/dashboard-card";
import SkeletonDashboard from "@/components/skeletondashboard";
import { useUser } from "@/hooks/useUser";
import { Sidebar } from "../../components/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) return <SkeletonDashboard />;

  return (
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 bg-white dark:bg-black">
          <section className="p-6 pt-20 space-y-6">
            <h1 className="text-2xl font-bold">👋 Hoş geldin, {user.fullname}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard title="Aktif Başvurular" value="2" />
              <DashboardCard title="Puanın" value="780" />
              <DashboardCard title="Cüzdan Sayısı" value="5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Hızlı Aksiyonlar</h2>
              <div className="flex flex-wrap gap-3">
                <ActionButton label="Yeni Başvuru" href="/basvuru/yeni" />
                <ActionButton label="Eğitimler" href="/egitimler" />
                <ActionButton label="Profilim" href="/profile" />
              </div>
            </div>

            <div className="border-t pt-4 space-y-1 text-sm">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> {user.role}</p>
            </div>
          </section>
        </main>
      </div>
  );
}
