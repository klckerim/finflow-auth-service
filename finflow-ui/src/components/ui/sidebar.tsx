
import Link from "next/link"
import { Home, FileText, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <aside className="h-screen w-64 dark:bg-gray-900 p-4 flex flex-col justify-between border-r">
      <div>
        <div className="text-xl font-bold mb-6">FinFlow</div>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:font-medium">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/basvurular" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:font-medium">
            <FileText className="w-4 h-4" />
            Başvurular
          </Link>
          <Link href="/ayarlar" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:font-medium">
            <Settings className="w-4 h-4" />
            Ayarlar
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">Hoşgeldin</div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
