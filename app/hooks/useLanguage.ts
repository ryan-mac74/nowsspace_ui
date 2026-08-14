"use client";

import { useState, useEffect, useCallback } from "react";

export const LANGUAGES = ["EN", "FR"] as const;
export type Language = typeof LANGUAGES[number];

const STORAGE_KEY = "nss-language";
const DEFAULT_LANGUAGE: Language = "EN";

const getStoredLanguage = (): Language => {
  const stored = localStorage.getItem(STORAGE_KEY) as Language;
  return LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE;
};

export default function useLanguage() {
  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const currentIndex = LANGUAGES.indexOf(prev);
      const nextLang = LANGUAGES[(currentIndex + 1) % LANGUAGES.length];

      // Update local storage to match the new language
      localStorage.setItem(STORAGE_KEY, nextLang);

      // Dispatch a custom event to sync language changes globally
      window.dispatchEvent(new Event("switch-language"));

      return nextLang;
    });
  }, []);

  useEffect(() => {
    // Listen for cross-tab changes
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === STORAGE_KEY) && (LANGUAGES.includes(e.newValue as Language))) {
        setLanguage(e.newValue as Language);
      }
    };

    // Listen for language changes
    const handleLanguageChange = () => {
      setLanguage(getStoredLanguage());
    };

    // Add event listeners to sync language changes
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("switch-language", handleLanguageChange);

    return () => {
      // Clean up event listeners on unmount
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("switch-language", handleLanguageChange);
    };
  }, []);

  return { language, toggleLanguage };
}
