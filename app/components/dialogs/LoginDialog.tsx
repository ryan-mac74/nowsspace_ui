"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link2, LogIn, X } from "lucide-react";
import Button from "../ui/Button";
import MenuIcon from "../ui/MenuIcon";
import useAuth from "../../hooks/useAuth";

const SDK_URL =
  process.env.NEXT_PUBLIC_SDK_URL ||
  "http://localhost:8080/api";

type Props = {
  className?: string;
};

export default function LoginDialog({ className }: Props) {
  const { isAuthenticated } = useAuth();

  const handleGoogleLogin = () => {
    window.location.href = `${SDK_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${SDK_URL}/auth/facebook`;
  };

  const actionIcon = isAuthenticated ? Link2 : LogIn;
  const actionLabel = isAuthenticated
    ? "Link Account"
    : "Log In";
  const actionTitle = isAuthenticated
    ? "Link a new account"
    : "Log in to your account";
  const description = isAuthenticated
    ? "Connect another profile from any of the providers below to your account for more login flexibility"
    : "Choose an account from any of the providers below for starters, then link another profile later";

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
            bg-zinc-900 border border-zinc-800 text-white
            rounded-2xl p-6 shadow-2xl
            flex flex-col gap-6
          "
        >
          <Dialog.Close asChild>
            <Button className="absolute left-2 top-2 !p-1 text-zinc-400 hover:text-white bg-transparent">
              <X className="size-5" />
            </Button>
          </Dialog.Close>

          <div className="text-center">
            <Dialog.Title className="text-xl font-bold text-white">
              {actionTitle}
            </Dialog.Title>

            <Dialog.Description className="text-sm text-zinc-400 mt-2 leading-relaxed">
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
              Continue with Google
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
              Continue with Facebook
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
