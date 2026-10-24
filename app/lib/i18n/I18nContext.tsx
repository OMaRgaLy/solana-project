"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, translations, Translations } from "./translations";

interface I18nContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  lang: "ru",
  setLang: () => {},
  t: translations.ru,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("ru");

  useEffect(() => {
    const saved = localStorage.getItem("steppe_lang") as Language | null;
    if (saved && (saved === "kk" || saved === "ru" || saved === "en")) {
      setLangState(saved);
    } else {
      // Auto detect user locale
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith("kk")) setLangState("kk");
      else if (navLang.startsWith("ru")) setLangState("ru");
      else setLangState("en");
    }
  }, []);

  const setLang = (next: Language) => {
    setLangState(next);
    localStorage.setItem("steppe_lang", next);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] || translations.ru }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
