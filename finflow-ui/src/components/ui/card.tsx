import * as React from "react";
import { cn } from "@/lib/utils";

export type CardProps = React.InputHTMLAttributes<HTMLInputElement>;

// Add to wallet card:
// className="hover:scale-[1.02] transition-transform duration-300"
// "rounded-2xl border p-6 shadow-md dark:bg-gray-950",

export function Card({ className, ...props }: CardProps) {
  return (
    <div
    
      className={cn(
        "rounded-2xl border p-6 shadow-md dark:bg-gray-950",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4 space-y-1", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props} />
  );
}
