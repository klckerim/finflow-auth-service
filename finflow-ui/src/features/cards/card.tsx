import * as React from "react";
import { cn } from "@/shared/lib/utils";

export type CardProps = React.InputHTMLAttributes<HTMLInputElement>;

// Add to wallet card:
// className="hover:scale-[1.02] transition-transform duration-300"
// "rounded-2xl border p-6 shadow-md dark:bg-gray-950",

export function Card({ className, ...props }: CardProps) {
  return (
    <div

      className={cn(
        "rounded-2xl bg-gradient-to-br to-gray-50 dark:from-gray-800/80 dark:to-gray-900 backdrop-blur-lg border p-6 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl ",
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

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
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


export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-6 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
