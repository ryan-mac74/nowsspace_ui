"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ConsentDialog from "../components/dialogs/ConsentDialog";
import useCustomToast from "../hooks/useCustomToast";
import useAuth from "../hooks/useAuth";
import useLanguage from "../hooks/useLanguage";

function OAuthHandlerInner() {
    const searchParams = useSearchParams();
    const auth = searchParams.get("auth");

    const router = useRouter();
    const pathname = usePathname();

    const [isLoading, setIsLoading] = useState(false);
    const [isConsentOpen, setIsConsentOpen] = useState(false);

    const { showSuccessToast, showErrorToast } = useCustomToast();
    const { oauthConsent } = useAuth();
    const { t } = useLanguage();

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
                    showSuccessToast(t("toast.loginSuccess"));
                    break;

                case "signup-success":
                    window.dispatchEvent(new Event("auth-login"));
                    showSuccessToast(t("toast.signupSuccess"));
                    break;

                case "link-success":
                    window.dispatchEvent(new Event("auth-login"));
                    showSuccessToast(t("toast.linkSuccess"));
                    break;

                case "link-error":
                    showErrorToast(t("toast.linkError"));
                    break;

                case "provider-success":
                    showSuccessToast(t("toast.providerSuccess"));
                    break;

                case "provider-error":
                    showErrorToast(t("toast.providerError"));
                    break;

                case "error":
                    showErrorToast(t("toast.authError"));
                    break;

                default:
                    break;
            }

            // Clean up URL without reloading the page
            router.replace(pathname);
        });
    }, [auth, pathname, router, showSuccessToast, showErrorToast, t]);

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
