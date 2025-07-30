// components/action-button.tsx
import Link from "next/link";

export function ActionButton({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
    >
      {label}
    </Link>
  );
}
