// Environment & Port
const ENV = process.env.NEXT_PUBLIC_ENV!;
export const isProd = ["production", "staging"].includes(ENV);

export const PORT = process.env.NEXT_PUBLIC_PORT
    ? parseInt(process.env.NEXT_PUBLIC_PORT)
    : 3100;

// Host Settings
export const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME!;

const ALLOWED_HOSTS = process.env.NEXT_PUBLIC_ALLOWED_HOSTS || "";
export const hosts = ALLOWED_HOSTS
    .split(",")
    .map((host) => host.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""))
    .filter(Boolean);

// Project Info
export const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME!;
export const APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE!;
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION!;

// Service URLs
export const UI_URL = process.env.NEXT_PUBLIC_UI_URL!;
export const SDK_URL = process.env.NEXT_PUBLIC_SDK_URL!;
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;

// Contact Info
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL!;
export const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL!;
export const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL!;
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL!;

// Push Notifications
export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

// List of required variables to validate
const requiredVars: Record<string, string | undefined> = {
    NEXT_PUBLIC_ENV: ENV,
    NEXT_PUBLIC_DOMAIN_NAME: DOMAIN_NAME,
    NEXT_PUBLIC_PROJECT_NAME: PROJECT_NAME,
    NEXT_PUBLIC_APP_TITLE: APP_TITLE,
    NEXT_PUBLIC_APP_DESCRIPTION: APP_DESCRIPTION,
    NEXT_PUBLIC_UI_URL: UI_URL,
    NEXT_PUBLIC_SDK_URL: SDK_URL,
    NEXT_PUBLIC_WS_URL: WS_URL,
    NEXT_PUBLIC_GITHUB_URL: GITHUB_URL,
    NEXT_PUBLIC_LINKEDIN_URL: LINKEDIN_URL,
    NEXT_PUBLIC_WHATSAPP_URL: WHATSAPP_URL,
    NEXT_PUBLIC_CONTACT_EMAIL: CONTACT_EMAIL,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: VAPID_PUBLIC_KEY,
};

// Find all variables that are missing, null, undefined, or empty strings
const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value || !value.trim())
    .map(([key]) => key);

if (missingVars.length > 0) {
    throw new Error(
        `❌ Missing required environment variables:\n   - ${missingVars.join("\n   - ")}`
    );
}
