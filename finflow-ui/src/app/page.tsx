"use client";

import { Skeleton } from "@/components/layout/skeleton";

export default function HomePage() {
  return (
      <div className="flex justify-center items-center min-h-screen">
        <Skeleton className="h-12 w-1/2" />
      </div>
    );
}
