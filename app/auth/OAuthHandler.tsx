"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ConsentDialog from "../components/dialogs/ConsentDialog";
import useCustomToast from "../hooks/useCustomToast";
import { setToken } from "../utils/token";
import useAuth from "../hooks/useAuth";

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || "token";

function OAuthHandlerInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const auth = searchParams.get("auth");
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(false);
    const [isConsentOpen, setIsConsentOpen] = useState(false);
    const [pendingConsentToken, setPendingConsentToken] = useState<string | null>(null);

    const { showSuccessToast, showErrorToast } = useCustomToast();
    const { oauthConsent } = useAuth();
    const lastHandledAuth = useRef<string | null>(null);

    useEffect(() => {
        // Prevent handling multiple times for the same auth action across re-renders
        if (!auth || lastHandledAuth.current === auth) {
            return;
        }
        lastHandledAuth.current = auth;

        // Defer state updates to a microtask frame 
        // so React get mounting done cleanly
        queueMicrotask(() => {
            if (auth === "consent") {
                if (token) {
                    // Save temporary token in state
                    setPendingConsentToken(token);
                    setIsConsentOpen(true);
                } else {
                    showErrorToast("Invalid/Missing consent token");
                }
            } else {
                if (token) {
                    // Save session token if available
                    setToken(TOKEN_KEY, token);

                    // Notify all instances of useAuth hook to update their state
                    window.dispatchEvent(new Event("auth-login"));
                }
            }

            if (auth === "error") {
                showErrorToast("Authentication failed");
            }
            if (auth === "signup-success") {
                showSuccessToast("Your account has been created");
            }
            if (auth === "login-success") {
                showSuccessToast("You are successfully logged in");
            }
            if (auth === "link-success") {
                showSuccessToast("Your accounts are now linked");
            }
            if (auth === "link-error") {
                showErrorToast("Account already linked to another user");
            }
            if (auth === "provider-success") {
                showSuccessToast("Your account is already linked to this user");
            }
            if (auth === "provider-error") {
                showErrorToast("You can't link accounts from the same provider");
            }

            // Clean up URL without reloading the page
            router.replace(pathname);
        });
    }, [auth, token, pathname, router, showSuccessToast, showErrorToast]);

    const handleOAuthConsent = async () => {
        if (!pendingConsentToken) {
            showErrorToast("Missing consent token");
            return;
        }

        // Set loading state
        setIsLoading(true);

        try {
            await oauthConsent(pendingConsentToken);
            setIsConsentOpen(false);
        } catch (error) {
            console.error("❌ Failed to create account:", error);
            setIsConsentOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (isConsentOpen) {
        return (
            <ConsentDialog
                isLoading={isLoading}
                isOpen={isConsentOpen}
                setOpen={setIsConsentOpen}
                onConfirm={handleOAuthConsent}
            />
        );
    }

    return null;
}

export default function OAuthHandler() {
    return (
        <Suspense fallback={null}>
            <OAuthHandlerInner />
        </Suspense>
    );
}
