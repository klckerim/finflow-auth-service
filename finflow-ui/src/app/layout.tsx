// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Sidebar from "@/components/ui/sidebar";
import Navbar from "@/components/ui/navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinFlow",
  description: "Modern ve minimalist dijital cüzdan çözümü",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={inter.className}>
      <body suppressHydrationWarning>
         {/* <div className="min-h-screen bg-muted/30"> */}
             <AuthProvider>
          <Toaster position="top-center" />
          <div className="flex min-h-screen w-full bg-background text-foreground">
            <Sidebar />
            <div className="flex-1 flex flex-col transition-all duration-300">
              <Navbar />
              <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
