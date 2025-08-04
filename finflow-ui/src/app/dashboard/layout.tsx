

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
     
      <main className="ml-0 md:ml-64 pt-16 px-6 pb-10 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}

