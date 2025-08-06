"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 p-6 pt-20 space-y-6 animate-pulse">
        <Skeleton className="h-8 w-[300px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-48" />
      </main>
    </div>
  );
}
