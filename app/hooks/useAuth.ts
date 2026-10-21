"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "../utils/auth";
import useCustomToast from "../hooks/useCustomToast";
import type { UserPublic } from "../types/users";
import { SDK_URL } from "../core/config";

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
      console.error("❌ Failed to fetch current user:", error);
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

    const handleLogin = () => {
      void fetchMe();
    };

    const handleLogout = () => {
      setUser(null);
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
      await authFetch(`${SDK_URL}/auth/logout`, {
        method: "POST",
      });
    } catch (error: unknown) {
      console.error("❌ Failed to log out:", error);
      showErrorToast("Something went wrong");
    } finally {
      setUser(null);

      // Notify all instances of this hook to update their state
      window.dispatchEvent(new Event("auth-logout"));

      // Redirect user to homepage
      router.push("/");

      if (toast) {
        showSuccessToast("You have been logged out");
      }
    }
  };

  const deleteAllAccounts = async () => {
    if (!user || !user.is_superuser) {
      return;
    }

    try {
      await authFetch(`${SDK_URL}/auth/delete-all`, {
        method: "POST",
      });
    } catch (error: unknown) {
      console.error("❌ Failed to process all scheduled account deletions:", error);
      showErrorToast("Something went wrong");
    } finally {
      showSuccessToast("All scheduled account deletions have been processed");
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      return;
    }

    try {
      await authFetch(`${SDK_URL}/auth/delete`, {
        method: "POST",
      });
    } catch (error: unknown) {
      console.error("❌ Failed to schedule account deletion:", error);
      showErrorToast("Something went wrong");
    } finally {
      // Update user local state
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
    }
  };

  const deactivateAccount = async () => {
    if (!user) {
      return;
    }

    try {
      await authFetch(`${SDK_URL}/auth/deactivate`, {
        method: "POST",
      });
    } catch (error: unknown) {
      console.error("❌ Failed to deactivate account:", error);
      showErrorToast("Something went wrong");
    } finally {
      // Update user local state
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
    }
  };

  const activateAccount = async () => {
    if (!user) {
      return;
    }

    try {
      await authFetch(`${SDK_URL}/auth/activate`, {
        method: "POST",
      });
    } catch (error: unknown) {
      console.error("❌ Failed to reactivate account:", error);
      showErrorToast("Something went wrong");
    } finally {
      // Update user local state
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
    }
  };

  const oauthConsent = async () => {
    try {
      await authFetch(`${SDK_URL}/auth/consent`, {
        method: "POST",
      });

      // Notify all instances of this hook to update their state
      window.dispatchEvent(new Event("auth-login"));

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
