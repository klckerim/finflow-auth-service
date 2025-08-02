// app/dashboard/layout.tsx
// "use client"

import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto pt-16 p-4">
          {children}
        </main>
      </div>
    </div>
  )
}

