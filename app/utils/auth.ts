import { getToken } from "./token";

const SDK_URL =
    process.env.NEXT_PUBLIC_SDK_URL ||
    "http://localhost:8080/api";

const ENV = process.env.NEXT_PUBLIC_ENV || "development";
const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || "token";

export const isProd = ["production", "staging"].includes(ENV);
export const authMode = isProd ? "cookie" : "bearer";

export function authFetch(
    url: string,
    options: RequestInit = {}
) {
    const config: RequestInit = { ...options };

    if (authMode === "cookie") {
        config.credentials = "include";
    } else {
        const token = getToken(TOKEN_KEY);

        config.headers = {
            ...options.headers,
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
        };
    }

    return fetch(url, config);
}

export function getAuthUrl(provider: string): string {
    const url = new URL(`${SDK_URL}/auth/${provider}`);
    const token = getToken(TOKEN_KEY);

    if (token) {
        url.searchParams.set("token", token);
    }
    return url.toString();
};
