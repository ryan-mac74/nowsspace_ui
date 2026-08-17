"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "../utils/auth";
import { setToken, clearToken } from "../utils/token";
import useCustomToast from "../hooks/useCustomToast";
import type { UserPublic } from "../types/users";

// Put static .env variables outside of the hook body (module scope)
// to keep the dependencies stable
const SDK_URL =
  process.env.NEXT_PUBLIC_SDK_URL ||
  "http://localhost:3000/api";
const TOKEN_KEY = process.env.TOKEN_KEY || "token";

export default function useAuth() {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const [user, setUser] = useState<UserPublic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await authFetch(`${SDK_URL}/auth/me`);

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user ?? null);
    } catch (error: unknown) {
      console.error("❌ Failed to fetch user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. React finishes mounting and completing the effect's setup phase
    // 2. The call stack clears up and control returns to the browser
    // 3. queueMicrotask runs fetchMe() immediately afterward in a new microtask frame
    // 4. React sees the state update as asynchronous, silencing the warning with no delays or performance impact
    queueMicrotask(() => {
      void fetchMe();
    });

    const handleLogout = () => setUser(null);
    const handleLogin = () => {
      void fetchMe();
    };

    // Sync login/logout across all components using this hook
    window.addEventListener("auth-logout", handleLogout);
    window.addEventListener("auth-login", handleLogin);

    return () => {
      // Clean up event listeners on unmount
      window.removeEventListener("auth-logout", handleLogout);
      window.removeEventListener("auth-login", handleLogin);
    };
  }, [fetchMe]);

  const logout = async (toast: boolean = true) => {
    try {
      const res = await authFetch(`${SDK_URL}/auth/logout`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("❌ Failed to log out");
      }

      clearToken(TOKEN_KEY);
      setUser(null);

      // Notify all instances of this hook to update their state
      window.dispatchEvent(new Event("auth-logout"));

      // Redirect user to homepage
      router.push("/");

      if (toast) {
        showSuccessToast("You have been logged out");
      }
    } catch (error: unknown) {
      console.error("❌ Failed to log out:", error);
      showErrorToast("Something went wrong");
    }
  };

  const deleteAllAccounts = async () => {
    if (!user || !user.is_superuser) {
      return;
    }

    try {
      const res = await authFetch(`${SDK_URL}/auth/delete-all`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("❌ Failed to process all scheduled account deletions");
      }

      showSuccessToast("All scheduled account deletions have been processed");
    } catch (error: unknown) {
      console.error("❌ Failed to process all scheduled account deletions:", error);
      showErrorToast("Something went wrong");
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      return;
    }

    try {
      const res = await authFetch(`${SDK_URL}/auth/delete`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("❌ Failed to schedule account deletion");
      }

      setUser((prev) =>
        prev
          ? {
            ...prev,
            is_active: false,
            deletedAt: new Date().toISOString(),
          }
          : null
      );

      // Redirect user to homepage
      router.push("/");

      showSuccessToast("Your account has been scheduled for deletion");
    } catch (error: unknown) {
      console.error("❌ Failed to schedule account deletion:", error);
      showErrorToast("Something went wrong");
    }
  };

  const deactivateAccount = async () => {
    if (!user) {
      return;
    }

    try {
      const res = await authFetch(`${SDK_URL}/auth/deactivate`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("❌ Failed to deactivate account");
      }

      setUser((prev) =>
        prev
          ? {
            ...prev,
            is_active: false,
          }
          : null
      );

      // Redirect user to homepage
      router.push("/");

      showSuccessToast("Your account has been deactivated");
    } catch (error: unknown) {
      console.error("❌ Failed to deactivate account:", error);
      showErrorToast("Something went wrong");
    }
  };

  const activateAccount = async () => {
    if (!user) {
      return;
    }

    try {
      const res = await authFetch(`${SDK_URL}/auth/activate`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("❌ Failed to reactivate account");
      }

      setUser((prev) =>
        prev
          ? {
            ...prev,
            is_active: true,
            deletedAt: undefined,
          }
          : null
      );

      // Redirect user to homepage
      router.push("/");

      showSuccessToast("Your account has been reactivated");
    } catch (error: unknown) {
      console.error("❌ Failed to reactivate account:", error);
      showErrorToast("Something went wrong");
    }
  };

  const oauthConsent = async (token: string | null) => {
    if (!token) {
      showErrorToast("Invalid/Missing consent token");
      return;
    }

    try {
      const res = await authFetch(`${SDK_URL}/auth/consent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        throw new Error("❌ Failed to create account");
      }

      const data = await res.json().catch(() => ({}));

      if (data.token) {
        // Save newly issued JWT token
        setToken(TOKEN_KEY, data.token);

        // Notify all instances of this hook to update their state
        window.dispatchEvent(new Event("auth-login"));
      }

      // Redirect user to homepage with success message
      router.push("/?auth=signup-success");
    } catch (error: unknown) {
      console.error("❌ Failed to create account:", error);
      showErrorToast("Something went wrong");
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    refetchMe: fetchMe,
    deleteAllAccounts,
    deleteAccount,
    deactivateAccount,
    activateAccount,
    oauthConsent,
  };
}
