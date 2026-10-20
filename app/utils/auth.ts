import { SDK_URL } from "../core/config";

export function authFetch(
    url: string,
    options: RequestInit = {}
) {
    const config: RequestInit = {
        ...options,
        credentials: "include",
    };

    return fetch(url, config);
}

export function getAuthUrl(provider: string): string {
    const url = new URL(`${SDK_URL}/auth/${provider}`);
    return url.toString();
};
