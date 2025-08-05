// layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
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
        <AuthProvider>
          <div className="flex min-h-screen w-full flex-col md:flex-row bg-background text-foreground">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="p-6 md:p-10 space-y-10">{children}
                <Toaster position="top-center" />
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
