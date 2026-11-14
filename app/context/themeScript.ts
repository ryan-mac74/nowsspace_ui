export const STORAGE_KEY = "nss-theme-preference";
export const MEDIA_QUERY = "(prefers-color-scheme: dark)";

// Earlier versions auto-saved the resolved theme here on every load, which would
// pin users to light/dark instead of the "system" default. Removed on startup.
const LEGACY_STORAGE_KEY = "nss-theme";

/**
 * Runs in <head> before first paint (see layout.tsx) so the saved choice, or
 * the OS setting by default, is applied without a flash of the wrong theme.
 */
export const themeInitScript = `(function(){try{localStorage.removeItem(${JSON.stringify(LEGACY_STORAGE_KEY)});var p=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});var d=p==="dark"||(p!=="light"&&window.matchMedia(${JSON.stringify(MEDIA_QUERY)}).matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
