import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function formatCurrency(value: number): string {
  return value.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
export function formatNumber(value: number): string {
  return value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
export function formatPercentage(value: number): string {
  return value.toLocaleString("tr-TR", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

