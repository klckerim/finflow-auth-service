"use client";

import { Link } from "lucide-react";
import { Button } from "./button";

export default function ActionButton({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href}>
      <Button variant="outline" className="rounded-full px-4 py-2 text-sm">
        {label}
      </Button>
    </Link>
  );
}
