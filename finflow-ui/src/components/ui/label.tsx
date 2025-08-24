"use client";

import { useLocale } from "@/context/locale-context";

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label {...props} className="block mb-1 font-medium text-gray-700" />
  );
}

export function getGreeting(): string {
  const { t } = useLocale();

  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return t("greeting.morning");
  if (hour >= 12 && hour < 17) return t("greeting.afternoon");
  if (hour >= 17 && hour < 22) return t("greeting.evening");
  return t("greeting.night");
}