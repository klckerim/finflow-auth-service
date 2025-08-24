
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import en from "@/locales/en.json";
import tr from "@/locales/tr.json";
import de from "@/locales/de.json";

const translations = {
  en,
  tr,
  de
};

type Locale = keyof typeof translations;
type Messages = typeof en;

interface LocaleContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
  t: () => "",
});

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && translations[saved]) {
      setLocale(saved);
    }
  }, []);

  // locale değiştiğinde kaydet
  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

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
