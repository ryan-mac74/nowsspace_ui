"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { TRANSLATIONS, type TranslationKey } from "../i18n/translations";

export const LANGUAGES = ["EN", "FR"] as const;
export type Language = typeof LANGUAGES[number];

const STORAGE_KEY = "nss-language";
const CHANGE_EVENT = "nss-language-change";
const DEFAULT_LANGUAGE: Language = "EN";

const isLanguage = (value: unknown): value is Language =>
  LANGUAGES.includes(value as Language);

// Pick the first supported language from the browser / OS preferences
const getSystemLanguage = (): Language => {
  const preferred = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const locale of preferred) {
    const code = locale?.slice(0, 2).toUpperCase();
    if (isLanguage(code)) {
      return code;
    }
  }

  return DEFAULT_LANGUAGE;
};

const getLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) {
      return stored;
    }
  } catch {
    // Storage unavailable, fall through to detection
  }

  return getSystemLanguage();
};

// Server has no access to the browser language, so fallback to the default language
const getServerLanguage = (): Language => DEFAULT_LANGUAGE;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback); // other tabs
  window.addEventListener(CHANGE_EVENT, callback); // this tab
  window.addEventListener("languagechange", callback); // OS / browser language change

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("languagechange", callback);
  };
}

export default function useLanguage() {
  const language = useSyncExternalStore(subscribe, getLanguage, getServerLanguage);

  const setLanguage = useCallback((next: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable, nothing to persist
    }

    // Notify every component using this hook
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const toggleLanguage = useCallback(() => {
    const currentIndex = LANGUAGES.indexOf(getLanguage());
    setLanguage(LANGUAGES[(currentIndex + 1) % LANGUAGES.length]);
  }, [setLanguage]);

  // Translate a key, replacing {placeholders} with the given params
  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      const text = TRANSLATIONS[language][key] ?? TRANSLATIONS[DEFAULT_LANGUAGE][key] ?? key;

      return params
        ? text.replace(/\{(\w+)\}/g, (match, name) =>
          name in params ? String(params[name]) : match
        )
        : text;
    },
    [language]
  );

  // Keep <html lang> in sync for screen readers and browser features
  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  return { language, setLanguage, toggleLanguage, t };
}
