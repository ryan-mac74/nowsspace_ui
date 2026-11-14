"use client";

import { createContext, useCallback, useEffect, useSyncExternalStore } from "react";
import { MEDIA_QUERY, STORAGE_KEY } from "./themeScript";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

type ThemeContextType = {
  theme: Theme;
  preference: ThemePreference;
  setTheme: (preference: ThemePreference) => void;
  toggleTheme: () => void;
};

/** system -> light -> dark -> system */
const CYCLE: Record<ThemePreference, ThemePreference> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const CHANGE_EVENT = "nss-theme-change";
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getPreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return ((saved === "light") || (saved === "dark")) ? saved : "system";
  } catch {
    return "system";
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function subscribe(callback: () => void) {
  const media = window.matchMedia(MEDIA_QUERY);

  window.addEventListener("storage", callback); // other tabs
  window.addEventListener(CHANGE_EVENT, callback); // this tab
  media.addEventListener("change", callback); // OS theme change

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
    media.removeEventListener("change", callback);
  };
}

const getServerPreference = (): ThemePreference => "system";
const getServerSystemTheme = (): Theme => "dark";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useSyncExternalStore(subscribe, getPreference, getServerPreference);
  const systemTheme = useSyncExternalStore(subscribe, getSystemTheme, getServerSystemTheme);
  const theme: Theme = preference === "system" ? systemTheme : preference;

  const setTheme = useCallback((next: ThemePreference) => {
    try {
      if (next === "system") {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      // Storage unavailable, nothing to persist
    }

    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(CYCLE[preference]);
  }, [preference, setTheme]);

  // Sync resolved theme -> DOM
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, preference, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };
