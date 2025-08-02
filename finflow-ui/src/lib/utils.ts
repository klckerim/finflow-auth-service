import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

export function cn(...inputs: (string | undefined | boolean)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export async function fetcher(url: string) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error('Network error');
  return res.json();
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
export function formatDateTimeWithSeconds(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
export function formatDateTimeWithSecondsAndTimezone(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}
export function formatDateWithTimezone(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZoneName: "short",
  });
}
export function formatTimeWithTimezone(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}
export function formatDateTimeWithTimezone(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}
export function formatDateTimeWithTimezoneAndSeconds(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}
export function formatDateTimeWithTimezoneAndSecondsAndMilliseconds(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    timeZoneName: "short",
  });
}
export function formatDateTimeWithTimezoneAndSecondsAndMillisecondsAndOffset(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    timeZoneName: "shortOffset",
  });
}
export function formatDateTimeWithTimezoneAndSecondsAndMillisecondsAndOffsetAndTimeZone(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    timeZoneName: "shortOffset",
  });
}