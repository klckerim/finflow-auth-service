import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinFlow",
  description: "Modern ve minimalist dijital cüzdan çözümü",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className={inter.className}>
      <body suppressHydrationWarning>
        <div className="bg-background min-h-screen p-6 md:p-10 max-w-6xl mx-auto space-y-10">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
          >
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}