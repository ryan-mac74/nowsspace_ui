import { getToken } from "@/utils/token";

const ENV = process.env.ENV || "development";
const TOKEN_KEY = process.env.TOKEN_KEY || "token";

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
