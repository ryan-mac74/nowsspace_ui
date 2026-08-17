export function setToken(TOKEN_KEY: string, token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(TOKEN_KEY: string): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(TOKEN_KEY: string) {
    localStorage.removeItem(TOKEN_KEY);
}
