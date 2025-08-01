"use client"

import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardCard from "@/components/dashboard-card"
import { ActionButton } from "@/components/action-button"

export default function DashboardPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      setRedirecting(true)
      router.push("/login")
    }
  }, [isLoading, user, router])

  if (isLoading || redirecting) {
    return (
      <div className="p-6">
        <p>{redirecting ? "Giriş sayfasına yönlendiriliyorsunuz..." : "Yükleniyor..."}</p>
      </div>
    )
  }

  if (!user) return null // renderdan kaçınmak için

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard title="Aktif Başvurular" value="2" />
        <DashboardCard title="Puanın" value="780" />
        <DashboardCard title="Kayıtlı Bütçeler" value="5" />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Hızlı Aksiyonlar</h2>
        <div className="flex flex-wrap gap-4">
          <ActionButton label="Yeni Başvuru Yap" href="/basvuru/yeni" />
          <ActionButton label="Eğitimleri Görüntüle" href="/egitimler" />
          <ActionButton label="Profilini Güncelle" href="/profil" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p><strong>Email:</strong> {user.Email}</p>
        <p><strong>Role:</strong> {user.Role}</p>
        <p><strong>Full Name:</strong> {user.FullName}</p>
      </div>
    </div>
  )
}
