// src/context/locale-context.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import en from "@/locales/en.json";
import tr from "@/locales/tr.json";

type Locale = "en" | "tr";
type Messages = typeof en; // JSON tipini otomatik alır

const translations: Record<Locale, Messages> = {
  en,
  tr,
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}>({
  locale: "en",
  setLocale: () => {},
  t: () => "",
});

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");

  const t = (key: string, vars?: Record<string, string | number>) => {
    const keys = key.split(".");
    let result: any = translations[locale];
    for (const k of keys) {
      result = result?.[k];
    }
    if (typeof result === "string" && vars) {
      Object.entries(vars).forEach(([v, val]) => {
        result = result.replace(`{${v}}`, String(val));
      });
    }
    return result || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
