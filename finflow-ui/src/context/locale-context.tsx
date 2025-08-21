"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Desteklenen diller
export type Locale = "en" | "tr";

interface LocaleContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextProps>({
  locale: "en",
  setLocale: () => {},
});

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Tarayıcı diline göre başlangıç değeri ayarla
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale) {
      setLocaleState(savedLocale);
    } else {
      const browserLang = navigator.language.startsWith("tr") ? "tr" : "en";
      setLocaleState(browserLang);
      localStorage.setItem("locale", browserLang);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

// Hook ile kolay kullanım
export const useLocale = () => useContext(LocaleContext);
