"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ConsentDialog from "../components/dialogs/ConsentDialog";
import useCustomToast from "../hooks/useCustomToast";
import useAuth from "../hooks/useAuth";

function OAuthHandlerInner() {
    const searchParams = useSearchParams();
    const auth = searchParams.get("auth");

    const router = useRouter();
    const pathname = usePathname();

    const [isLoading, setIsLoading] = useState(false);
    const [isConsentOpen, setIsConsentOpen] = useState(false);

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
                setIsConsentOpen(true);
            }

            switch (auth) {
                case "login-success":
                    window.dispatchEvent(new Event("auth-login"));
                    showSuccessToast("You are successfully logged in");
                    break;

                case "signup-success":
                    window.dispatchEvent(new Event("auth-login"));
                    showSuccessToast("Your account has been created");
                    break;

                case "link-success":
                    window.dispatchEvent(new Event("auth-login"));
                    showSuccessToast("Your accounts are now linked");
                    break;

                case "link-error":
                    showErrorToast("Account already linked to another user");
                    break;

                case "provider-success":
                    showSuccessToast("Your account is already linked to this user");
                    break;

                case "provider-error":
                    showErrorToast("You can't link accounts from the same provider");
                    break;

                case "error":
                    showErrorToast("Authentication failed");
                    break;

                default:
                    break;
            }

            // Clean up URL without reloading the page
            router.replace(pathname);
        });
    }, [auth, pathname, router, showSuccessToast, showErrorToast]);

    const handleOAuthConsent = async () => {
        // Set loading state
        setIsLoading(true);

        try {
            await oauthConsent();
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
