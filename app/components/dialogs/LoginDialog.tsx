"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link2, LogIn, X } from "lucide-react";
import Button from "../ui/Button";
import MenuIcon from "../ui/MenuIcon";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import { getAuthUrl } from "../../utils/auth";

type Props = {
  className?: string;
};

export default function LoginDialog({ className }: Props) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const handleGoogleLogin = () => {
    window.location.href = getAuthUrl("google");
  };

  const handleFacebookLogin = () => {
    window.location.href = getAuthUrl("facebook");
  };

  const actionIcon = isAuthenticated ? Link2 : LogIn;
  const actionLabel = isAuthenticated
    ? t("auth.linkAccount")
    : t("auth.login");
  const actionTitle = isAuthenticated
    ? t("auth.linkTitle")
    : t("auth.loginTitle");
  const description = isAuthenticated
    ? t("auth.linkDescription")
    : t("auth.loginDescription");

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className={className}>
          <MenuIcon Icon={actionIcon} />
          {actionLabel}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md" />

        <Dialog.Content
          className="
            fixed z-50 left-1/2 top-1/2 w-[90%] max-w-md
            -translate-x-1/2 -translate-y-1/2
            bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white
            rounded-2xl p-6 shadow-2xl
            flex flex-col gap-6
          "
        >
          <Dialog.Close asChild>
            <Button className="absolute left-2 top-2 !p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-transparent">
              <X className="size-5" />
            </Button>
          </Dialog.Close>

          <div className="text-center">
            <Dialog.Title className="text-xl font-bold text-zinc-900 dark:text-white">
              {actionTitle}
            </Dialog.Title>

            <Dialog.Description className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              {description}
            </Dialog.Description>
          </div>

          <div className="grid gap-3">
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className="
                w-full bg-white text-zinc-900 font-semibold py-3 px-4 rounded-xl 
                hover:bg-zinc-100 transition-colors shadow-sm cursor-pointer
                flex items-center justify-center gap-3 text-sm
              "
            >
              <FcGoogle className="size-5" />
              {t("auth.continueWithGoogle")}
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookLogin}
              className="
                w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold 
                py-3 px-4 rounded-xl transition-colors shadow-sm cursor-pointer
                flex items-center justify-center gap-3 text-sm
              "
            >
              <FaFacebook className="size-5" />
              {t("auth.continueWithFacebook")}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
